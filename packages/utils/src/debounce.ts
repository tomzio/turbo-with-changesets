// Custom debounce function with immediate execution on first call
export function debounce(func: Function, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null
  return function (this: ThisParameterType<typeof func>, ...args: any[]) {
    const callNow = !timeout

    if (timeout) clearTimeout(timeout)

    if (callNow) {
      func.apply(this, args)
    }

    timeout = setTimeout(() => {
      timeout = null
    }, wait)
  }
}
