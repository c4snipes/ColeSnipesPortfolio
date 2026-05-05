import { useState, useEffect } from 'react'

/**
 * Hook for detecting device type, touch capability, and orientation
 * @returns {Object} Device information
 */
export function useDeviceType() {
  const [device, setDevice] = useState({
    isMobile: false,        // < 768px
    isTablet: false,        // 768-1024px
    isDesktop: true,        // > 1024px
    isTouch: false,         // pointer: coarse (touch screen)
    isLandscape: false,     // width > height
    prefersReducedMotion: false,
    viewportWidth: typeof window !== 'undefined' ? window.innerWidth : 1024,
    viewportHeight: typeof window !== 'undefined' ? window.innerHeight : 768
  })

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      setDevice({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        isTouch: window.matchMedia('(pointer: coarse)').matches,
        isLandscape: width > height,
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        viewportWidth: width,
        viewportHeight: height
      })
    }

    // Initial update
    update()

    // Listen for resize and orientation changes
    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)

    // Also listen for media query changes
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const touchQuery = window.matchMedia('(pointer: coarse)')

    reducedMotionQuery.addEventListener('change', update)
    touchQuery.addEventListener('change', update)

    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
      reducedMotionQuery.removeEventListener('change', update)
      touchQuery.removeEventListener('change', update)
    }
  }, [])

  return device
}
