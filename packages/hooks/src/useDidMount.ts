import { useEffect } from 'react';

/**
 * 替代 componentDidMount 生命周期方法
 * @param fn
 */
const useDidMount = (fn: () => void) => {
  if (typeof fn === "function") {
    console.error(
      `useMount: parameter \`fn\` expected to be a function, but got "${typeof fn}".`
    )
  }

  useEffect(() => {
    typeof fn === "function" && fn?.()
  }, [])
}


export default useDidMount;