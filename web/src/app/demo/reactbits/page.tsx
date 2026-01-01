'use client';

import type { CSSProperties } from 'react';
import { Bricolage_Grotesque, Figtree } from 'next/font/google';
import Link from 'next/link';
import Ballpit from '@/components/animations/Ballpit';

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-reactbits-display',
});

const body = Figtree({
  subsets: ['latin'],
  variable: '--font-reactbits-body',
});

const themeVars = {
  '--rb-bg': '#060010',
  '--rb-surface': '#0d0716',
  '--rb-surface-strong': '#170d27',
  '--rb-border': 'rgba(169, 148, 184, 0.28)',
  '--rb-border-soft': 'rgba(169, 148, 184, 0.16)',
  '--rb-text': '#f5f5f5',
  '--rb-muted': '#a1a1aa',
  '--rb-accent': '#5227ff',
  '--rb-accent-2': '#8400ff',
  '--rb-accent-3': '#a855f7',
  '--rb-glow': '0 0 40px rgba(124, 58, 237, 0.28)',
  '--rb-glow-strong': '0 0 80px rgba(124, 58, 237, 0.4)',
  '--rb-gradient': 'linear-gradient(135deg, #ffffff 0%, #8660fa 30%, #a855f7 60%, #8400ff 85%, #ffffff 100%)',
} as CSSProperties;

const cards = [
  {
    title: 'Glowing Bento',
    copy: 'Layered surfaces, gradient borders, and soft neon depth.',
  },
  {
    title: 'Shimmer Button',
    copy: 'Subtle sweep highlight that reads premium, not noisy.',
  },
  {
    title: 'Animated Type',
    copy: 'Gradient text with a controlled shimmer cadence.',
  },
  {
    title: 'Spotlight Cards',
    copy: 'Cursor-driven glow that focuses attention on intent.',
  },
  {
    title: 'Glass Pill',
    copy: 'Blurred badge with micro-shadow to float above the hero.',
  },
  {
    title: 'Grid Texture',
    copy: 'Radial dot grid with masks to keep the page airy.',
  },
];

export default function ReactbitsDemoPage() {
  return (
    <div
      className={`${display.variable} ${body.variable} min-h-screen bg-[var(--rb-bg)] text-[var(--rb-text)]`}
      style={themeVars}
    >
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 rb-grid" aria-hidden="true" />
        <div className="absolute inset-0 rb-aurora" aria-hidden="true" />
        <div className="absolute inset-0 rb-scanline" aria-hidden="true" />
        <div className="absolute inset-0 rb-noise" aria-hidden="true" />
        <div className="absolute -top-32 right-[-10%] h-[360px] w-[360px] rounded-full bg-[var(--rb-accent)]/30 blur-[140px]" aria-hidden="true" />
        <div className="absolute top-40 left-[-5%] h-[280px] w-[280px] rounded-full bg-[var(--rb-accent-3)]/25 blur-[120px]" aria-hidden="true" />
        <div className="absolute left-[8%] top-[14%] h-40 w-40 rb-orb rb-orb-1" aria-hidden="true" />
        <div className="absolute right-[12%] top-[28%] h-52 w-52 rb-orb rb-orb-2" aria-hidden="true" />
        <div className="absolute bottom-[-6%] left-[18%] h-36 w-36 rb-orb rb-orb-3" aria-hidden="true" />
        <div className="rb-flight" aria-hidden="true">
          <div className="rb-flight-path rb-flight-path-1">
            <span className="rb-trail" />
            <span className="rb-ball" />
          </div>
          <div className="rb-flight-path rb-flight-path-2">
            <span className="rb-trail" />
            <span className="rb-ball" />
          </div>
          <div className="rb-flight-path rb-flight-path-3">
            <span className="rb-trail" />
            <span className="rb-ball" />
          </div>
        </div>

        <header className="mx-auto flex max-w-6xl items-center justify-between px-6 pb-12 pt-10">
          <div className="flex items-center gap-3 text-sm font-semibold text-[var(--rb-text)]">
            <span className="h-2 w-2 rounded-full bg-[var(--rb-accent)] shadow-[var(--rb-glow)]" />
            React Bits Demo
          </div>
          <nav className="hidden items-center gap-6 text-sm text-[var(--rb-muted)] md:flex">
            <a className="transition hover:text-[var(--rb-text)]" href="#bento">Bento</a>
            <a className="transition hover:text-[var(--rb-text)]" href="#components">Components</a>
            <a className="transition hover:text-[var(--rb-text)]" href="#cta">CTA</a>
          </nav>
          <Link
            className="rb-pill border border-[var(--rb-border-soft)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--rb-muted)] transition hover:text-[var(--rb-text)]"
            href="/"
          >
            Back to Tee:up
          </Link>
        </header>

        <section className="mx-auto flex max-w-6xl flex-col items-center px-6 pb-24 text-center">
          <div className="rb-pill mb-6 inline-flex items-center gap-2 border border-[var(--rb-border)] bg-[var(--rb-surface)]/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[var(--rb-muted)]">
            Curated Motion System
          </div>
          <h1 className="rb-gradient-text max-w-4xl text-balance text-4xl font-semibold leading-tight md:text-6xl">
            React Bits inspired motion language, rebuilt for Tee:up.
          </h1>
          <p className="mt-6 max-w-2xl text-base text-[var(--rb-muted)] md:text-lg">
            A dark, neon-focused palette paired with glass layers, glowing borders, and bento layouts. This demo is a visual reference, not a production theme.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button className="rb-shimmer-button">Browse Components</button>
            <button className="rb-outline-button">View Motion Specs</button>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-xs text-[var(--rb-muted)]">
            <span className="rb-pill border border-[var(--rb-border-soft)] px-3 py-1">Gradient Type</span>
            <span className="rb-pill border border-[var(--rb-border-soft)] px-3 py-1">Glass Surfaces</span>
            <span className="rb-pill border border-[var(--rb-border-soft)] px-3 py-1">Neon Accents</span>
          </div>
        </section>
      </div>

      <section id="bento" className="mx-auto max-w-6xl px-6 pb-24">
        <div className="flex flex-col gap-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--rb-muted)]">Bento Grid</p>
          <h2 className="rb-gradient-text text-3xl font-semibold md:text-5xl">Layered cards with hover glow.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-[var(--rb-muted)] md:text-base">
            Cards emphasize depth through soft borders, animated gradients, and slight elevation on hover.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card, index) => (
            <div
              key={card.title}
              className="rb-card group relative overflow-hidden rounded-2xl border border-[var(--rb-border-soft)] bg-[var(--rb-surface)] p-6"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100 rb-card-glow" aria-hidden="true" />
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--rb-muted)]">0{index + 1}</p>
              <h3 className="mt-4 text-xl font-semibold text-[var(--rb-text)]">{card.title}</h3>
              <p className="mt-3 text-sm text-[var(--rb-muted)]">{card.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="components" className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-[var(--rb-border-soft)] bg-[var(--rb-surface)] p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--rb-muted)]">Hero Button</p>
            <h3 className="mt-4 text-3xl font-semibold text-[var(--rb-text)]">Shimmer CTA</h3>
            <p className="mt-3 text-sm text-[var(--rb-muted)]">
              Uses a soft sweep highlight and layered glow. Hover to see the shimmer surface.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button className="rb-shimmer-button">Start Building</button>
              <button className="rb-outline-button">Copy Snippet</button>
            </div>
          </div>
          <div className="rounded-3xl border border-[var(--rb-border-soft)] bg-[var(--rb-surface-strong)] p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--rb-muted)]">Spotlight</p>
            <h3 className="mt-4 text-2xl font-semibold text-[var(--rb-text)]">Neon Focus Card</h3>
            <p className="mt-3 text-sm text-[var(--rb-muted)]">
              Simulates a spotlight gradient to keep focus centered on the message.
            </p>
            <div className="rb-spotlight mt-8 rounded-2xl border border-[var(--rb-border-soft)] px-6 py-8 text-sm text-[var(--rb-muted)]">
              Hover to see the glow bloom across the surface.
            </div>
          </div>
        </div>
      </section>

      <section id="ballpit" className="mx-auto max-w-6xl px-6 pb-24">
        <div className="flex flex-col gap-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--rb-muted)]">Golf Ball Pit</p>
          <h2 className="rb-gradient-text text-3xl font-semibold md:text-5xl">Soft dimpled golf spheres.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-[var(--rb-muted)] md:text-base">
            Inspired by the React Bits ballpit, tuned for a golf-ball feel and gentle physics.
          </p>
        </div>
        <div className="mt-10 rounded-3xl border border-[var(--rb-border-soft)] bg-[var(--rb-surface)]/60 p-2 shadow-[var(--rb-glow)]">
          <div className="relative h-[500px] w-full overflow-hidden rounded-[22px] bg-[var(--rb-bg)]">
            <Ballpit
              className="absolute inset-0"
              count={180}
              gravity={0.7}
              friction={0.8}
              wallBounce={0.95}
              followCursor={true}
              minSize={0.55}
              maxSize={1.1}
              dimpleFrequency={40}
              dimpleStrength={0.06}
              materialParams={{
                roughness: 0.3,
                metalness: 0.1,
                clearcoat: 0.7,
                clearcoatRoughness: 0.18,
              }}
              colors={[0xffffff, 0xf3f4ff, 0xdfe3f2]}
            />
          </div>
        </div>
      </section>

      <section id="cta" className="mx-auto max-w-6xl px-6 pb-28">
        <div className="rb-cta rounded-[32px] border border-[var(--rb-border-soft)] bg-[var(--rb-surface)] p-10 text-center md:p-14">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--rb-muted)]">Next Step</p>
          <h2 className="rb-gradient-text mt-4 text-3xl font-semibold md:text-5xl">
            Ready to remix this into Tee:up?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-[var(--rb-muted)] md:text-base">
            This is a visual checkpoint. We can convert it into production-safe tokens once the direction is approved.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button className="rb-shimmer-button">Approve Direction</button>
            <button className="rb-outline-button">Refine Palette</button>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .rb-gradient-text {
          font-family: var(--font-reactbits-display);
          background-image: var(--rb-gradient);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: rb-gradient-shift 6s ease-in-out infinite;
        }

        .rb-pill {
          border-radius: 999px;
          backdrop-filter: blur(16px);
        }

        .rb-grid {
          background-image: radial-gradient(circle, rgba(82, 39, 255, 0.35) 1px, transparent 1px);
          background-size: 24px 24px;
          mask: linear-gradient(transparent 0%, black 30%, black 70%, transparent 100%);
          opacity: 0.3;
        }

        .rb-aurora {
          background:
            radial-gradient(500px circle at 20% 0%, rgba(132, 0, 255, 0.25), transparent 60%),
            radial-gradient(400px circle at 80% 10%, rgba(82, 39, 255, 0.2), transparent 55%),
            linear-gradient(120deg, rgba(82, 39, 255, 0.18), transparent 40%, rgba(168, 85, 247, 0.2) 70%);
          filter: blur(12px);
          opacity: 0.7;
          animation: rb-aurora-float 12s ease-in-out infinite;
        }

        .rb-scanline {
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), transparent 30%, transparent 70%, rgba(255, 255, 255, 0.04));
          opacity: 0.3;
          mix-blend-mode: screen;
          animation: rb-scanline 8s linear infinite;
        }

        .rb-noise {
          background-image: url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E");
          opacity: 0.1;
          mix-blend-mode: overlay;
        }

        .rb-orb {
          border-radius: 999px;
          border: 1px solid rgba(169, 148, 184, 0.35);
          background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.35), rgba(82, 39, 255, 0.25), transparent 70%);
          box-shadow: 0 0 60px rgba(82, 39, 255, 0.25);
          animation: rb-orb-float 10s ease-in-out infinite;
        }

        .rb-orb-1 {
          animation-delay: -1.5s;
        }

        .rb-orb-2 {
          animation-delay: -3s;
        }

        .rb-orb-3 {
          animation-delay: -4.5s;
        }

        .rb-flight {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 2;
        }

        .rb-flight-path {
          position: absolute;
          left: -15%;
          top: 45%;
          width: 220px;
          height: 2px;
          transform-origin: left center;
          animation: rb-flight-arc 9s linear infinite;
          opacity: 0;
        }

        .rb-flight-path-2 {
          top: 30%;
          animation-delay: -3.2s;
          animation-duration: 10.5s;
        }

        .rb-flight-path-3 {
          top: 58%;
          animation-delay: -6.4s;
          animation-duration: 12s;
        }

        .rb-trail {
          position: absolute;
          left: 0;
          top: 50%;
          width: 180px;
          height: 2px;
          transform: translateY(-50%);
          background: linear-gradient(90deg, transparent 0%, rgba(82, 39, 255, 0.45) 35%, rgba(255, 255, 255, 0.7) 70%, transparent 100%);
          filter: blur(0.5px);
        }

        .rb-ball {
          position: absolute;
          right: -10px;
          top: 50%;
          width: 16px;
          height: 16px;
          border-radius: 999px;
          transform: translateY(-50%);
          background:
            radial-gradient(circle at 30% 30%, #ffffff 0%, #e7e7f2 45%, #b9b9cc 100%);
          box-shadow: 0 0 12px rgba(255, 255, 255, 0.45), 0 0 24px rgba(82, 39, 255, 0.35);
          animation: rb-ball-spin 1.6s linear infinite;
        }

        .rb-ball::after {
          content: '';
          position: absolute;
          inset: 2px;
          border-radius: 999px;
          background-image: radial-gradient(circle, rgba(50, 50, 70, 0.35) 1px, transparent 1px);
          background-size: 6px 6px;
          opacity: 0.35;
        }

        .rb-shimmer-button {
          position: relative;
          overflow: hidden;
          border-radius: 999px;
          padding: 0 2rem;
          height: 56px;
          font-family: var(--font-reactbits-body);
          font-weight: 600;
          color: #fff;
          background: var(--rb-accent);
          box-shadow: var(--rb-glow);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .rb-shimmer-button::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 0%, rgba(255, 255, 255, 0.35) 50%, transparent 100%);
          transform: translateX(-120%);
          animation: rb-shimmer 3.5s ease infinite;
        }

        .rb-shimmer-button:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: var(--rb-glow-strong);
        }

        .rb-outline-button {
          border-radius: 999px;
          border: 1px solid var(--rb-border);
          padding: 0 1.8rem;
          height: 54px;
          font-family: var(--font-reactbits-body);
          font-weight: 600;
          color: var(--rb-text);
          background: rgba(6, 0, 16, 0.4);
          transition: border-color 0.25s ease, transform 0.25s ease;
        }

        .rb-outline-button:hover {
          border-color: rgba(255, 255, 255, 0.6);
          transform: translateY(-1px);
        }

        .rb-card {
          font-family: var(--font-reactbits-body);
          animation: rb-fade-up 0.6s ease forwards;
          opacity: 0;
          transform: translateY(14px);
        }

        .rb-card-glow {
          background: radial-gradient(240px circle at 50% 20%, rgba(132, 0, 255, 0.4) 0%, transparent 60%);
        }

        .rb-spotlight {
          position: relative;
          overflow: hidden;
          background: radial-gradient(160px circle at 40% 20%, rgba(132, 0, 255, 0.35), transparent 70%);
        }

        .rb-spotlight::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(200px circle at var(--spotlight-x, 50%) var(--spotlight-y, 35%), rgba(82, 39, 255, 0.35), transparent 65%);
          opacity: 0;
          transition: opacity 0.35s ease;
        }

        .rb-spotlight:hover::after {
          opacity: 1;
        }

        .rb-cta {
          position: relative;
          overflow: hidden;
        }

        .rb-cta::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, rgba(82, 39, 255, 0.25), transparent 60%);
          opacity: 0.7;
          pointer-events: none;
        }

        @keyframes rb-gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes rb-aurora-float {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(0, -12px, 0) scale(1.04);
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
        }

        @keyframes rb-scanline {
          0% {
            transform: translateY(-12%);
          }
          100% {
            transform: translateY(12%);
          }
        }

        @keyframes rb-orb-float {
          0% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(0, -18px, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }

        @keyframes rb-flight-arc {
          0% {
            opacity: 0;
            transform: translate3d(0, 0, 0) rotate(-8deg);
          }
          10% {
            opacity: 1;
          }
          50% {
            transform: translate3d(70vw, -18vh, 0) rotate(12deg);
            opacity: 1;
          }
          100% {
            transform: translate3d(120vw, 8vh, 0) rotate(26deg);
            opacity: 0;
          }
        }

        @keyframes rb-ball-spin {
          from {
            transform: translateY(-50%) rotate(0deg);
          }
          to {
            transform: translateY(-50%) rotate(360deg);
          }
        }

        @keyframes rb-shimmer {
          0% {
            transform: translateX(-120%);
          }
          60% {
            transform: translateX(120%);
          }
          100% {
            transform: translateX(120%);
          }
        }

        @keyframes rb-fade-up {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
