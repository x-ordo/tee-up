import { renderHook } from '@testing-library/react';
import { useRef } from 'react';
import useFocusTrap from '@/hooks/useFocusTrap';

// Mock 요소 생성
const createMockContainer = () => {
  const container = document.createElement('div');
  const button1 = document.createElement('button');
  button1.textContent = 'Button 1';
  const button2 = document.createElement('button');
  button2.textContent = 'Button 2';
  const input = document.createElement('input');
  input.type = 'text';

  container.appendChild(button1);
  container.appendChild(button2);
  container.appendChild(input);
  document.body.appendChild(container);

  return { container, button1, button2, input };
};

describe('useFocusTrap', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should not trap focus when isActive is false', () => {
    const { container } = createMockContainer();
    const ref = { current: container };

    renderHook(() => useFocusTrap(ref, false));

    // 포커스가 자동으로 이동하지 않아야 함
    expect(document.activeElement).toBe(document.body);
  });

  it('should focus first focusable element when active', async () => {
    const { container, button1 } = createMockContainer();
    const ref = { current: container };

    renderHook(() => useFocusTrap(ref, true));

    // requestAnimationFrame 대기
    await new Promise((resolve) => requestAnimationFrame(resolve));

    expect(document.activeElement).toBe(button1);
  });

  it('should call onClose when Escape is pressed', async () => {
    const { container } = createMockContainer();
    const ref = { current: container };
    const onClose = jest.fn();

    renderHook(() => useFocusTrap(ref, true, { onClose }));

    // Escape 키 이벤트 발생
    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(escapeEvent);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should trap Tab at last element', async () => {
    const { container, button1, input } = createMockContainer();
    const ref = { current: container };

    renderHook(() => useFocusTrap(ref, true));

    // 마지막 요소에 포커스
    input.focus();
    expect(document.activeElement).toBe(input);

    // Tab 키 이벤트 발생
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
    Object.defineProperty(tabEvent, 'shiftKey', { value: false });
    document.dispatchEvent(tabEvent);

    // 마지막 요소에서 Tab을 누르면 첫 번째 요소로 순환해야 함
    expect(document.activeElement).toBe(button1);
  });

  it('should trap Shift+Tab at first element', async () => {
    const { container, button1, input } = createMockContainer();
    const ref = { current: container };

    renderHook(() => useFocusTrap(ref, true));

    // 첫 번째 요소에 포커스
    await new Promise((resolve) => requestAnimationFrame(resolve));
    expect(document.activeElement).toBe(button1);

    // Shift+Tab 키 이벤트 발생
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true });
    document.dispatchEvent(tabEvent);

    // 첫 번째 요소에서 Shift+Tab을 누르면 마지막 요소로 순환해야 함
    expect(document.activeElement).toBe(input);
  });
});
