/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react'
import { useTheme as useNextTheme } from 'next-themes'
import { useTheme } from '@/hooks/useTheme'

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}))

const mockUseNextTheme = useNextTheme as jest.MockedFunction<typeof useNextTheme>

describe('useTheme hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with mounted state and theme', () => {
    mockUseNextTheme.mockReturnValue({
      theme: 'system',
      resolvedTheme: 'light',
      setTheme: jest.fn(),
      themes: ['light', 'dark', 'system'],
      forcedTheme: undefined,
      systemTheme: 'light',
    })

    const { result } = renderHook(() => useTheme())

    // After initial render (useEffect runs synchronously in React 18)
    expect(result.current.mounted).toBe(true)
    expect(result.current.theme).toBe('light')
  })

  it('should return light theme after mounting', async () => {
    mockUseNextTheme.mockReturnValue({
      theme: 'light',
      resolvedTheme: 'light',
      setTheme: jest.fn(),
      themes: ['light', 'dark', 'system'],
      forcedTheme: undefined,
      systemTheme: 'light',
    })

    const { result, rerender } = renderHook(() => useTheme())

    // Wait for mount effect
    await act(async () => {
      rerender()
    })

    expect(result.current.mounted).toBe(true)
    expect(result.current.theme).toBe('light')
    expect(result.current.isLight).toBe(true)
    expect(result.current.isDark).toBe(false)
  })

  it('should return dark theme when resolved theme is dark', async () => {
    mockUseNextTheme.mockReturnValue({
      theme: 'dark',
      resolvedTheme: 'dark',
      setTheme: jest.fn(),
      themes: ['light', 'dark', 'system'],
      forcedTheme: undefined,
      systemTheme: 'light',
    })

    const { result, rerender } = renderHook(() => useTheme())

    await act(async () => {
      rerender()
    })

    expect(result.current.theme).toBe('dark')
    expect(result.current.isDark).toBe(true)
    expect(result.current.isLight).toBe(false)
  })

  it('should toggle theme from light to dark', async () => {
    const mockSetTheme = jest.fn()
    mockUseNextTheme.mockReturnValue({
      theme: 'light',
      resolvedTheme: 'light',
      setTheme: mockSetTheme,
      themes: ['light', 'dark', 'system'],
      forcedTheme: undefined,
      systemTheme: 'light',
    })

    const { result, rerender } = renderHook(() => useTheme())

    await act(async () => {
      rerender()
    })

    act(() => {
      result.current.toggleTheme()
    })

    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('should toggle theme from dark to light', async () => {
    const mockSetTheme = jest.fn()
    mockUseNextTheme.mockReturnValue({
      theme: 'dark',
      resolvedTheme: 'dark',
      setTheme: mockSetTheme,
      themes: ['light', 'dark', 'system'],
      forcedTheme: undefined,
      systemTheme: 'light',
    })

    const { result, rerender } = renderHook(() => useTheme())

    await act(async () => {
      rerender()
    })

    act(() => {
      result.current.toggleTheme()
    })

    expect(mockSetTheme).toHaveBeenCalledWith('light')
  })

  it('should return correct themePreference for system theme', async () => {
    mockUseNextTheme.mockReturnValue({
      theme: 'system',
      resolvedTheme: 'light',
      setTheme: jest.fn(),
      themes: ['light', 'dark', 'system'],
      forcedTheme: undefined,
      systemTheme: 'light',
    })

    const { result, rerender } = renderHook(() => useTheme())

    await act(async () => {
      rerender()
    })

    expect(result.current.themePreference).toBe('system')
    expect(result.current.theme).toBe('light') // resolved theme
  })

  it('should call setTheme with correct preference', async () => {
    const mockSetTheme = jest.fn()
    mockUseNextTheme.mockReturnValue({
      theme: 'light',
      resolvedTheme: 'light',
      setTheme: mockSetTheme,
      themes: ['light', 'dark', 'system'],
      forcedTheme: undefined,
      systemTheme: 'light',
    })

    const { result, rerender } = renderHook(() => useTheme())

    await act(async () => {
      rerender()
    })

    act(() => {
      result.current.setTheme('system')
    })

    expect(mockSetTheme).toHaveBeenCalledWith('system')
  })
})
