'use client';

import { useEffect, useRef } from 'react';
import {
  Clock,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  SRGBColorSpace,
  MathUtils,
  Vector2,
  Vector3,
  MeshPhysicalMaterial,
  ShaderChunk,
  Color,
  Object3D,
  InstancedMesh,
  PMREMGenerator,
  SphereGeometry,
  AmbientLight,
  PointLight,
  ACESFilmicToneMapping,
  Raycaster,
  Plane,
  type MeshPhysicalMaterialParameters,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

type BallpitConfig = {
  count: number;
  colors: number[];
  ambientColor: number;
  ambientIntensity: number;
  lightIntensity: number;
  materialParams: MeshPhysicalMaterialParameters;
  minSize: number;
  maxSize: number;
  size0: number;
  gravity: number;
  friction: number;
  wallBounce: number;
  maxVelocity: number;
  maxX: number;
  maxY: number;
  maxZ: number;
  controlSphere0: boolean;
  followCursor: boolean;
  dimpleFrequency: number;
  dimpleStrength: number;
};

type BallpitOptions = Partial<Omit<BallpitConfig, 'materialParams'>> & {
  materialParams?: MeshPhysicalMaterialParameters;
};

type BallpitProps = BallpitOptions & {
  className?: string;
};

class ThreeCanvas {
  canvas!: HTMLCanvasElement;
  camera!: PerspectiveCamera;
  cameraMinAspect?: number;
  cameraMaxAspect?: number;
  cameraFov!: number;
  maxPixelRatio?: number;
  minPixelRatio?: number;
  scene!: Scene;
  renderer!: WebGLRenderer;
  size = { width: 0, height: 0, wWidth: 0, wHeight: 0, ratio: 0, pixelRatio: 0 };
  render: () => void = () => {};
  onBeforeRender: (time: { elapsed: number; delta: number }) => void = () => {};
  onAfterRender: (time: { elapsed: number; delta: number }) => void = () => {};
  onAfterResize: (size: typeof this.size) => void = () => {};

  #clock = new Clock();
  #time = { elapsed: 0, delta: 0 };
  #postprocessing?: { setSize: (w: number, h: number) => void; render: () => void; dispose: () => void };
  #rendering = false;
  #visible = false;
  #sizeObserver?: ResizeObserver;
  #intersectObserver?: IntersectionObserver;
  #resizeTimer?: ReturnType<typeof setTimeout>;
  #rafId = 0;
  #config: { canvas?: HTMLCanvasElement | null; id?: string; size?: 'parent' | { width: number; height: number }; rendererOptions?: Record<string, unknown> };

  constructor(options: { canvas?: HTMLCanvasElement | null; id?: string; size?: 'parent' | { width: number; height: number }; rendererOptions?: Record<string, unknown> }) {
    this.#config = { ...options };
    this.createCamera();
    this.createScene();
    this.createRenderer();
    this.render = this.renderDefault;
    this.resize();
    this.bindEvents();
  }

  createCamera() {
    this.camera = new PerspectiveCamera();
    this.cameraFov = this.camera.fov;
  }

  createScene() {
    this.scene = new Scene();
  }

  createRenderer() {
    if (this.#config.canvas) {
      this.canvas = this.#config.canvas;
    } else if (this.#config.id) {
      const found = document.getElementById(this.#config.id);
      if (found instanceof HTMLCanvasElement) {
        this.canvas = found;
      }
    }

    if (!this.canvas) {
      throw new Error('Ballpit: Missing canvas element');
    }

    this.canvas.style.display = 'block';

    const rendererOptions = {
      canvas: this.canvas,
      powerPreference: 'high-performance' as const,
      ...(this.#config.rendererOptions ?? {}),
    };

    this.renderer = new WebGLRenderer(rendererOptions);
    this.renderer.outputColorSpace = SRGBColorSpace;
  }

  bindEvents() {
    if (this.#config.size !== 'parent' && !(this.#config.size instanceof Object)) {
      window.addEventListener('resize', this.handleResize);
    }

    if (this.#config.size === 'parent' && this.canvas.parentElement) {
      this.#sizeObserver = new ResizeObserver(this.handleResize);
      this.#sizeObserver.observe(this.canvas.parentElement);
    }

    this.#intersectObserver = new IntersectionObserver(this.handleIntersection, {
      root: null,
      rootMargin: '0px',
      threshold: 0,
    });
    this.#intersectObserver.observe(this.canvas);
    document.addEventListener('visibilitychange', this.handleVisibility);
  }

  cleanupEvents() {
    window.removeEventListener('resize', this.handleResize);
    this.#sizeObserver?.disconnect();
    this.#intersectObserver?.disconnect();
    document.removeEventListener('visibilitychange', this.handleVisibility);
  }

  handleIntersection = (entries: IntersectionObserverEntry[]) => {
    this.#visible = entries[0]?.isIntersecting ?? false;
    if (this.#visible) {
      this.start();
    } else {
      this.stop();
    }
  };

  handleVisibility = () => {
    if (!this.#visible) return;
    if (document.hidden) {
      this.stop();
    } else {
      this.start();
    }
  };

  handleResize = () => {
    if (this.#resizeTimer) clearTimeout(this.#resizeTimer);
    this.#resizeTimer = setTimeout(() => this.resize(), 100);
  };

  resize() {
    let width = window.innerWidth;
    let height = window.innerHeight;

    if (this.#config.size instanceof Object) {
      width = this.#config.size.width;
      height = this.#config.size.height;
    } else if (this.#config.size === 'parent' && this.canvas.parentNode) {
      width = (this.canvas.parentNode as HTMLElement).offsetWidth;
      height = (this.canvas.parentNode as HTMLElement).offsetHeight;
    }

    this.size.width = width;
    this.size.height = height;
    this.size.ratio = width / height;
    this.updateCamera();
    this.updateRenderer();
    this.onAfterResize(this.size);
  }

  updateCamera() {
    this.camera.aspect = this.size.width / this.size.height;
    if (this.cameraMinAspect && this.camera.aspect < this.cameraMinAspect) {
      this.setCameraFov(this.cameraMinAspect);
    } else if (this.cameraMaxAspect && this.camera.aspect > this.cameraMaxAspect) {
      this.setCameraFov(this.cameraMaxAspect);
    } else {
      this.camera.fov = this.cameraFov;
    }
    this.camera.updateProjectionMatrix();
    this.updateWorldSize();
  }

  setCameraFov(aspect: number) {
    const tangent = Math.tan(MathUtils.degToRad(this.cameraFov / 2)) / (this.camera.aspect / aspect);
    this.camera.fov = 2 * MathUtils.radToDeg(Math.atan(tangent));
  }

  updateWorldSize() {
    const fov = (this.camera.fov * Math.PI) / 180;
    this.size.wHeight = 2 * Math.tan(fov / 2) * this.camera.position.length();
    this.size.wWidth = this.size.wHeight * this.camera.aspect;
  }

  updateRenderer() {
    this.renderer.setSize(this.size.width, this.size.height);
    this.#postprocessing?.setSize(this.size.width, this.size.height);
    let pixelRatio = window.devicePixelRatio;
    if (this.maxPixelRatio && pixelRatio > this.maxPixelRatio) {
      pixelRatio = this.maxPixelRatio;
    } else if (this.minPixelRatio && pixelRatio < this.minPixelRatio) {
      pixelRatio = this.minPixelRatio;
    }
    this.renderer.setPixelRatio(pixelRatio);
    this.size.pixelRatio = pixelRatio;
  }

  get postprocessing() {
    return this.#postprocessing;
  }

  set postprocessing(value) {
    this.#postprocessing = value;
    if (value) {
      this.render = value.render.bind(value);
    }
  }

  start() {
    if (this.#rendering) return;
    const tick = () => {
      this.#rafId = requestAnimationFrame(tick);
      this.#time.delta = this.#clock.getDelta();
      this.#time.elapsed += this.#time.delta;
      this.onBeforeRender(this.#time);
      this.render();
      this.onAfterRender(this.#time);
    };
    this.#rendering = true;
    this.#clock.start();
    tick();
  }

  stop() {
    if (!this.#rendering) return;
    cancelAnimationFrame(this.#rafId);
    this.#rendering = false;
    this.#clock.stop();
  }

  renderDefault = () => {
    this.renderer.render(this.scene, this.camera);
  };

  clear() {
    this.scene.traverse((obj) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mesh = obj as any;
      if (mesh.isMesh && mesh.material) {
        const material = mesh.material as Record<string, unknown>;
        Object.values(material).forEach((value) => {
          if (value && typeof value === 'object' && 'dispose' in value && typeof (value as { dispose?: unknown }).dispose === 'function') {
            (value as { dispose: () => void }).dispose();
          }
        });
        if (typeof mesh.material.dispose === 'function') {
          mesh.material.dispose();
        }
        if (mesh.geometry && typeof mesh.geometry.dispose === 'function') {
          mesh.geometry.dispose();
        }
      }
    });
    this.scene.clear();
  }

  dispose() {
    this.cleanupEvents();
    this.stop();
    this.clear();
    this.#postprocessing?.dispose();
    this.renderer.dispose();
  }
}

type PointerTracker = {
  position: Vector2;
  nPosition: Vector2;
  hover: boolean;
  touching: boolean;
  onEnter: (tracker: PointerTracker) => void;
  onMove: (tracker: PointerTracker) => void;
  onClick: (tracker: PointerTracker) => void;
  onLeave: (tracker: PointerTracker) => void;
  dispose: () => void;
  domElement: Element;
};

const pointerTargets = new Map<Element, PointerTracker>();
const pointer = new Vector2();
let pointerEventsAttached = false;

function createPointerTracker(options: {
  domElement: Element;
  onEnter?: (tracker: PointerTracker) => void;
  onMove?: (tracker: PointerTracker) => void;
  onClick?: (tracker: PointerTracker) => void;
  onLeave?: (tracker: PointerTracker) => void;
}): PointerTracker {
  const tracker: PointerTracker = {
    position: new Vector2(),
    nPosition: new Vector2(),
    hover: false,
    touching: false,
    onEnter: options.onEnter ?? (() => {}),
    onMove: options.onMove ?? (() => {}),
    onClick: options.onClick ?? (() => {}),
    onLeave: options.onLeave ?? (() => {}),
    dispose: () => {},
    domElement: options.domElement,
  };

  if (!pointerTargets.has(options.domElement)) {
    pointerTargets.set(options.domElement, tracker);
    if (!pointerEventsAttached) {
      document.body.addEventListener('pointermove', handlePointerMove);
      document.body.addEventListener('pointerleave', handlePointerLeave);
      document.body.addEventListener('click', handlePointerClick);
      document.body.addEventListener('touchstart', handleTouchStart, { passive: false });
      document.body.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.body.addEventListener('touchend', handleTouchEnd, { passive: false });
      document.body.addEventListener('touchcancel', handleTouchEnd, { passive: false });
      pointerEventsAttached = true;
    }
  }

  tracker.dispose = () => {
    pointerTargets.delete(options.domElement);
    if (pointerTargets.size === 0 && pointerEventsAttached) {
      document.body.removeEventListener('pointermove', handlePointerMove);
      document.body.removeEventListener('pointerleave', handlePointerLeave);
      document.body.removeEventListener('click', handlePointerClick);
      document.body.removeEventListener('touchstart', handleTouchStart);
      document.body.removeEventListener('touchmove', handleTouchMove);
      document.body.removeEventListener('touchend', handleTouchEnd);
      document.body.removeEventListener('touchcancel', handleTouchEnd);
      pointerEventsAttached = false;
    }
  };

  return tracker;
}

function handlePointerMove(event: PointerEvent) {
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  processInteractions();
}

function handlePointerClick(event: MouseEvent) {
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  pointerTargets.forEach((tracker) => {
    const rect = tracker.domElement.getBoundingClientRect();
    updateTracker(tracker, rect);
    if (isInside(rect)) tracker.onClick(tracker);
  });
}

function handlePointerLeave() {
  pointerTargets.forEach((tracker) => {
    if (tracker.hover) {
      tracker.hover = false;
      tracker.onLeave(tracker);
    }
  });
}

function handleTouchStart(event: TouchEvent) {
  if (event.touches.length === 0) return;
  event.preventDefault();
  pointer.x = event.touches[0].clientX;
  pointer.y = event.touches[0].clientY;
  pointerTargets.forEach((tracker) => {
    const rect = tracker.domElement.getBoundingClientRect();
    if (isInside(rect)) {
      tracker.touching = true;
      updateTracker(tracker, rect);
      if (!tracker.hover) {
        tracker.hover = true;
        tracker.onEnter(tracker);
      }
      tracker.onMove(tracker);
    }
  });
}

function handleTouchMove(event: TouchEvent) {
  if (event.touches.length === 0) return;
  event.preventDefault();
  pointer.x = event.touches[0].clientX;
  pointer.y = event.touches[0].clientY;
  pointerTargets.forEach((tracker) => {
    const rect = tracker.domElement.getBoundingClientRect();
    updateTracker(tracker, rect);
    if (isInside(rect)) {
      if (!tracker.hover) {
        tracker.hover = true;
        tracker.touching = true;
        tracker.onEnter(tracker);
      }
      tracker.onMove(tracker);
    } else if (tracker.hover && tracker.touching) {
      tracker.onMove(tracker);
    }
  });
}

function handleTouchEnd() {
  pointerTargets.forEach((tracker) => {
    if (tracker.touching) {
      tracker.touching = false;
      if (tracker.hover) {
        tracker.hover = false;
        tracker.onLeave(tracker);
      }
    }
  });
}

function processInteractions() {
  pointerTargets.forEach((tracker) => {
    const rect = tracker.domElement.getBoundingClientRect();
    if (isInside(rect)) {
      updateTracker(tracker, rect);
      if (!tracker.hover) {
        tracker.hover = true;
        tracker.onEnter(tracker);
      }
      tracker.onMove(tracker);
    } else if (tracker.hover && !tracker.touching) {
      tracker.hover = false;
      tracker.onLeave(tracker);
    }
  });
}

function updateTracker(tracker: ReturnType<typeof createPointerTracker>, rect: DOMRect) {
  tracker.position.x = pointer.x - rect.left;
  tracker.position.y = pointer.y - rect.top;
  tracker.nPosition.x = (tracker.position.x / rect.width) * 2 - 1;
  tracker.nPosition.y = (-tracker.position.y / rect.height) * 2 + 1;
}

function isInside(rect: DOMRect) {
  return pointer.x >= rect.left && pointer.x <= rect.left + rect.width && pointer.y >= rect.top && pointer.y <= rect.top + rect.height;
}

const { randFloat, randFloatSpread } = MathUtils;
const vecA = new Vector3();
const vecB = new Vector3();
const vecC = new Vector3();
const vecD = new Vector3();
const vecE = new Vector3();
const vecF = new Vector3();
const vecG = new Vector3();
const vecH = new Vector3();
const vecI = new Vector3();
const vecJ = new Vector3();

class SpherePhysics {
  config: BallpitConfig;
  positionData: Float32Array;
  velocityData: Float32Array;
  sizeData: Float32Array;
  center = new Vector3();

  constructor(config: BallpitConfig) {
    this.config = config;
    this.positionData = new Float32Array(3 * config.count).fill(0);
    this.velocityData = new Float32Array(3 * config.count).fill(0);
    this.sizeData = new Float32Array(config.count).fill(1);
    this.resetPositions();
    this.setSizes();
  }

  resetPositions() {
    const { config, positionData } = this;
    this.center.toArray(positionData, 0);
    for (let idx = 1; idx < config.count; idx += 1) {
      const base = 3 * idx;
      positionData[base] = randFloatSpread(2 * config.maxX);
      positionData[base + 1] = randFloatSpread(2 * config.maxY);
      positionData[base + 2] = randFloatSpread(2 * config.maxZ);
    }
  }

  setSizes() {
    const { config, sizeData } = this;
    sizeData[0] = config.size0;
    for (let idx = 1; idx < config.count; idx += 1) {
      sizeData[idx] = randFloat(config.minSize, config.maxSize);
    }
  }

  update(time: { delta: number }) {
    const { config, center, positionData, sizeData, velocityData } = this;
    let startIndex = 0;

    if (config.controlSphere0) {
      startIndex = 1;
      vecA.fromArray(positionData, 0);
      vecA.lerp(center, 0.1).toArray(positionData, 0);
      vecD.set(0, 0, 0).toArray(velocityData, 0);
    }

    for (let idx = startIndex; idx < config.count; idx += 1) {
      const base = 3 * idx;
      vecB.fromArray(positionData, base);
      vecE.fromArray(velocityData, base);
      vecE.y -= time.delta * config.gravity * sizeData[idx];
      vecE.multiplyScalar(config.friction);
      vecE.clampLength(0, config.maxVelocity);
      vecB.add(vecE);
      vecB.toArray(positionData, base);
      vecE.toArray(velocityData, base);
    }

    for (let idx = startIndex; idx < config.count; idx += 1) {
      const base = 3 * idx;
      vecB.fromArray(positionData, base);
      vecE.fromArray(velocityData, base);
      const radius = sizeData[idx];

      for (let j = idx + 1; j < config.count; j += 1) {
        const otherBase = 3 * j;
        vecC.fromArray(positionData, otherBase);
        vecF.fromArray(velocityData, otherBase);
        const otherRadius = sizeData[j];
        vecG.copy(vecC).sub(vecB);
        const dist = vecG.length();
        const sumRadius = radius + otherRadius;

        if (dist < sumRadius) {
          const overlap = sumRadius - dist;
          vecH.copy(vecG).normalize().multiplyScalar(0.5 * overlap);
          vecI.copy(vecH).multiplyScalar(Math.max(vecE.length(), 1));
          vecJ.copy(vecH).multiplyScalar(Math.max(vecF.length(), 1));

          vecB.sub(vecH);
          vecE.sub(vecI);
          vecB.toArray(positionData, base);
          vecE.toArray(velocityData, base);

          vecC.add(vecH);
          vecF.add(vecJ);
          vecC.toArray(positionData, otherBase);
          vecF.toArray(velocityData, otherBase);
        }
      }

      if (config.controlSphere0) {
        vecG.copy(vecA).sub(vecB);
        const dist = vecG.length();
        const sumRadius0 = radius + sizeData[0];
        if (dist < sumRadius0) {
          const diff = sumRadius0 - dist;
          vecH.copy(vecG.normalize()).multiplyScalar(diff);
          vecI.copy(vecH).multiplyScalar(Math.max(vecE.length(), 2));
          vecB.sub(vecH);
          vecE.sub(vecI);
        }
      }

      if (Math.abs(vecB.x) + radius > config.maxX) {
        vecB.x = Math.sign(vecB.x) * (config.maxX - radius);
        vecE.x = -vecE.x * config.wallBounce;
      }

      if (config.gravity === 0) {
        if (Math.abs(vecB.y) + radius > config.maxY) {
          vecB.y = Math.sign(vecB.y) * (config.maxY - radius);
          vecE.y = -vecE.y * config.wallBounce;
        }
      } else if (vecB.y - radius < -config.maxY) {
        vecB.y = -config.maxY + radius;
        vecE.y = -vecE.y * config.wallBounce;
      }

      const maxBoundary = Math.max(config.maxZ, config.maxSize);
      if (Math.abs(vecB.z) + radius > maxBoundary) {
        vecB.z = Math.sign(vecB.z) * (config.maxZ - radius);
        vecE.z = -vecE.z * config.wallBounce;
      }

      vecB.toArray(positionData, base);
      vecE.toArray(velocityData, base);
    }
  }
}

class GolfBallMaterial extends MeshPhysicalMaterial {
  uniforms: Record<string, { value: number }> = {
    thicknessDistortion: { value: 0.1 },
    thicknessAmbient: { value: 0 },
    thicknessAttenuation: { value: 0.1 },
    thicknessPower: { value: 2 },
    thicknessScale: { value: 10 },
    dimpleFrequency: { value: 36 },
    dimpleStrength: { value: 0.05 },
  };

  constructor(params: MeshPhysicalMaterialParameters, config: BallpitConfig) {
    super(params);
    this.uniforms.dimpleFrequency.value = config.dimpleFrequency;
    this.uniforms.dimpleStrength.value = config.dimpleStrength;
    if (!this.defines) this.defines = {};
    this.defines.USE_UV = '';
    this.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, this.uniforms);

      shader.vertexShader =
        `
        uniform float dimpleFrequency;
        uniform float dimpleStrength;
      ` + shader.vertexShader;

      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        float dimpleWave = sin(uv.x * dimpleFrequency) * sin(uv.y * dimpleFrequency);
        float dimpleMask = smoothstep(0.25, 0.9, abs(dimpleWave));
        transformed -= normal * dimpleMask * dimpleStrength;
      `
      );

      shader.fragmentShader =
        `
        uniform float thicknessPower;
        uniform float thicknessScale;
        uniform float thicknessDistortion;
        uniform float thicknessAmbient;
        uniform float thicknessAttenuation;
      ` + shader.fragmentShader;

      shader.fragmentShader = shader.fragmentShader.replace(
        'void main() {',
        `
        void RE_Direct_Scattering(const in IncidentLight directLight, const in vec2 uv, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, inout ReflectedLight reflectedLight) {
          vec3 scatteringHalf = normalize(directLight.direction + (geometryNormal * thicknessDistortion));
          float scatteringDot = pow(saturate(dot(geometryViewDir, -scatteringHalf)), thicknessPower) * thicknessScale;
          #ifdef USE_COLOR
            vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * vColor;
          #else
            vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * diffuse;
          #endif
          reflectedLight.directDiffuse += scatteringIllu * thicknessAttenuation * directLight.color;
        }

        void main() {
      `
      );

      const lightsChunk = ShaderChunk.lights_fragment_begin.replaceAll(
        'RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );',
        `
          RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
          RE_Direct_Scattering(directLight, vUv, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, reflectedLight);
        `
      );
      shader.fragmentShader = shader.fragmentShader.replace('#include <lights_fragment_begin>', lightsChunk);
    };
  }
}

const DEFAULT_CONFIG: BallpitConfig = {
  count: 200,
  colors: [0xffffff, 0xf0f0f7, 0xe3e3ef],
  ambientColor: 0xffffff,
  ambientIntensity: 1.1,
  lightIntensity: 140,
  materialParams: {
    metalness: 0.15,
    roughness: 0.35,
    clearcoat: 0.6,
    clearcoatRoughness: 0.2,
  },
  minSize: 0.5,
  maxSize: 1.05,
  size0: 1,
  gravity: 0.5,
  friction: 0.9975,
  wallBounce: 0.95,
  maxVelocity: 0.15,
  maxX: 5,
  maxY: 5,
  maxZ: 2,
  controlSphere0: false,
  followCursor: true,
  dimpleFrequency: 38,
  dimpleStrength: 0.055,
};

const tempObject = new Object3D();

class BallpitSpheres extends InstancedMesh {
  config: BallpitConfig;
  physics: SpherePhysics;
  ambientLight: AmbientLight;
  light: PointLight;

  constructor(renderer: WebGLRenderer, options: BallpitOptions = {}) {
    const config: BallpitConfig = {
      ...DEFAULT_CONFIG,
      ...options,
      materialParams: {
        ...DEFAULT_CONFIG.materialParams,
        ...options.materialParams,
      },
    };
    const env = new RoomEnvironment();
    const pmremGenerator = new PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const envMap = pmremGenerator.fromScene(env).texture;
    const geometry = new SphereGeometry();
    const material = new GolfBallMaterial({ envMap, ...config.materialParams }, config);
    material.envMapRotation.x = -Math.PI / 2;
    super(geometry, material, config.count);

    this.config = config;
    this.physics = new SpherePhysics(config);
    this.ambientLight = new AmbientLight(config.ambientColor, config.ambientIntensity);
    this.light = new PointLight(config.colors[0], config.lightIntensity);
    this.add(this.ambientLight);
    this.add(this.light);
    this.setColors(config.colors);
  }

  setColors(colors: number[]) {
    if (!Array.isArray(colors) || colors.length <= 1) return;

    const palette = colors.map((value) => new Color(value));
    const getColorAt = (ratio: number, out = new Color()) => {
      const scaled = Math.max(0, Math.min(1, ratio)) * (palette.length - 1);
      const index = Math.floor(scaled);
      const start = palette[index];
      if (index >= palette.length - 1) return start.clone();
      const alpha = scaled - index;
      const end = palette[index + 1];
      out.r = start.r + alpha * (end.r - start.r);
      out.g = start.g + alpha * (end.g - start.g);
      out.b = start.b + alpha * (end.b - start.b);
      return out;
    };

    for (let idx = 0; idx < this.count; idx += 1) {
      this.setColorAt(idx, getColorAt(idx / this.count));
      if (idx === 0) {
        this.light.color.copy(getColorAt(idx / this.count));
      }
    }
    if (this.instanceColor) {
      this.instanceColor.needsUpdate = true;
    }
  }

  update(time: { delta: number }) {
    this.physics.update(time);
    for (let idx = 0; idx < this.count; idx += 1) {
      tempObject.position.fromArray(this.physics.positionData, 3 * idx);
      if (idx === 0 && this.config.followCursor === false) {
        tempObject.scale.setScalar(0);
      } else {
        tempObject.scale.setScalar(this.physics.sizeData[idx]);
      }
      tempObject.updateMatrix();
      this.setMatrixAt(idx, tempObject.matrix);
      if (idx === 0) this.light.position.copy(tempObject.position);
    }
    this.instanceMatrix.needsUpdate = true;
  }
}

function createBallpit(canvas: HTMLCanvasElement, options: BallpitOptions = {}) {
  const three = new ThreeCanvas({
    canvas,
    size: 'parent',
    rendererOptions: { antialias: true, alpha: true },
  });
  let spheres = new BallpitSpheres(three.renderer, options);

  three.renderer.toneMapping = ACESFilmicToneMapping;
  three.camera.position.set(0, 0, 20);
  three.camera.lookAt(0, 0, 0);
  three.cameraMaxAspect = 1.5;
  three.resize();

  const raycaster = new Raycaster();
  const plane = new Plane(new Vector3(0, 0, 1), 0);
  const intersection = new Vector3();
  let paused = false;

  canvas.style.touchAction = 'none';
  canvas.style.userSelect = 'none';
  canvas.style.webkitUserSelect = 'none';

  let tracker: ReturnType<typeof createPointerTracker> | null = null;

  if (options.followCursor !== false) {
    tracker = createPointerTracker({
      domElement: canvas,
      onMove() {
        raycaster.setFromCamera(tracker!.nPosition, three.camera);
        three.camera.getWorldDirection(plane.normal);
        raycaster.ray.intersectPlane(plane, intersection);
        spheres.physics.center.copy(intersection);
        spheres.config.controlSphere0 = true;
      },
      onLeave() {
        spheres.config.controlSphere0 = false;
      },
    });
  }

  const initialize = (config: BallpitOptions) => {
    if (spheres) {
      three.clear();
      three.scene.remove(spheres);
    }
    spheres = new BallpitSpheres(three.renderer, config);
    three.scene.add(spheres);
  };

  initialize(options);

  three.onBeforeRender = (time) => {
    if (!paused) spheres.update(time);
  };

  three.onAfterResize = (size) => {
    spheres.config.maxX = size.wWidth / 2;
    spheres.config.maxY = size.wHeight / 2;
  };

  return {
    three,
    get spheres() {
      return spheres;
    },
    setCount(count: number) {
      initialize({ ...spheres.config, count });
    },
    togglePause() {
      paused = !paused;
    },
    dispose() {
      tracker?.dispose();
      three.dispose();
    },
  };
}

export default function Ballpit({ className = '', followCursor = true, ...props }: BallpitProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const instanceRef = useRef<ReturnType<typeof createBallpit> | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    instanceRef.current = createBallpit(canvas, { followCursor, ...props });

    return () => {
      instanceRef.current?.dispose();
      instanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
