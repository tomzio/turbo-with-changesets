import { useEffect, useRef } from "react";

/**
 * 保存上一次渲染时状态
 * @param {*} state
 * @param {*} compare
 * @returns
 */
function usePrevious(state: any, compare: (arg0: any, arg1: any) => boolean) {
  const prevRef = useRef();
  const curRef = useRef();

  const needUpdate = typeof compare === 'function' ? compare(curRef.current, state) : true;
  if (needUpdate) {
    prevRef.current = curRef.current;
    curRef.current = state;
  }

  return prevRef.current;
}


export function _usePrevious<T>(value: T) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef<T>(value);

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

export default usePrevious;
