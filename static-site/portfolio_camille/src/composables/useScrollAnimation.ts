import { ref } from 'vue'

// Single shared observer instance
const observerMap = new WeakMap<HTMLElement, Function[]>()
let sharedObserver: IntersectionObserver | null = null

export function useScrollAnimation(options = { threshold: 0.1, rootMargin: '50px' }) {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const isVisible = ref(false)

  function getSharedObserver() {
    if (!sharedObserver) {
      sharedObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          const callbacks = observerMap.get(entry.target as HTMLElement)
          if (callbacks) {
            callbacks.forEach(callback => {
              if (typeof callback === 'function') {
                callback(entry.isIntersecting)
              }
            })
          }
        })
      }, options)
    }
    return sharedObserver
  }

  function observe(element: HTMLElement) {
    if (prefersReducedMotion) {
      isVisible.value = true
      return { isVisible, observer: null }
    }

    const observer = getSharedObserver()
    const callback = (visible: boolean) => {
      isVisible.value = visible
    }

    const callbacks = observerMap.get(element) || []
    callbacks.push(callback)
    observerMap.set(element, callbacks)
    observer.observe(element)

    return { isVisible, observer }
  }

  function cleanup() {
    if (sharedObserver) {
      // Properly cleanup all observed elements
      sharedObserver.disconnect()
      
      // Clear all entries by unobserving them
      const observer = getSharedObserver()
      observer.takeRecords().forEach(entry => {
        const element = entry.target as HTMLElement
        observer.unobserve(element)
        observerMap.delete(element)
      })
      
      sharedObserver = null
    }
  }

  const initScrollAnimation = () => {
    const elements = document.querySelectorAll('[data-scroll]')
    elements.forEach(element => {
      observe(element as HTMLElement)
    })
  }

  return {
    observe,
    cleanup,
    initScrollAnimation
  }
} 