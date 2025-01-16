import { useState, useEffect } from 'react'

function checkIsDarkMode() {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  } catch (err) {
    return false
  }
}

function useIsDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(checkIsDarkMode())

  useEffect(() => {
    const mqList = window.matchMedia('(prefers-color-scheme: dark)')

    /**
     * @param {MediaQueryListEvent} event
     */
    const listener = (event: MediaQueryListEvent) => {
      setIsDarkMode(event.matches)
    }

    mqList.addEventListener('change', listener)

    return () => {
      mqList.removeEventListener('change', listener)
    }
  }, [])

  return isDarkMode
}

export default useIsDarkMode
