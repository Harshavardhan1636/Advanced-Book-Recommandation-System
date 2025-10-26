import { useEffect, useRef, useCallback } from 'react'

export function useIntersectionObserver(callback: () => void, options?: IntersectionObserverInit) {
  const target = useRef<HTMLDivElement>(null)

  const setTarget = useCallback((element: HTMLDivElement | null) => {
    if (element) {
      target.current = element
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            callback()
          }
        })
      },
      {
        threshold: 0.1,
        ...options,
      }
    )

    if (target.current) {
      observer.observe(target.current)
    }

    return () => {
      if (target.current) {
        observer.unobserve(target.current)
      }
      observer.disconnect()
    }
  }, [callback, options])

  return { setTarget }
}
