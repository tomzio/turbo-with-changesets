import { useEffect, useRef } from 'react'

/**
 * 替代 componentDidUpdate 生命周期方法
 * @param {*} callback
 * @param {*} dependencies
 */
function useDidUpdate(callback: Function, dependencies: []) {
  const didMount = useRef(false)

  useEffect(() => {
    if (didMount.current) {
      callback()
    } else {
      didMount.current = true
    }
  }, [callback, dependencies])
}

export default useDidUpdate
