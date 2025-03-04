import { useCallback, useLayoutEffect, useRef } from 'react';

export { default as useMouse } from './useMouse';
export { default as useSize } from './useSize';
export { default as useUpdate } from './useUpdate'
export { default as usePrevious } from './usePrevious'
export { default as useDidUpdate } from './useDidUpdate'
export { default as useDidMount } from './useDidMount'

/**
 * 缓存事件函数引用
 * @param {*} handler 事件函数
 * @returns 返回事件引用
 */
export function useEvent(handler: any) {
  const handlerRef = useRef(null);

  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  return useCallback((...args) => {
    const fn: any = handlerRef.current;
    return fn(...args);
  }, []);
}
