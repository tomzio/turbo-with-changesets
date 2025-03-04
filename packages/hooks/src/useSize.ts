import { useLayoutEffect, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { getTargetElement } from './utils/dom';

function useSize(target: any) {
  const [state, setState] = useState(() => {
    const el = getTargetElement(target);
    return {
      width: (el || {}).clientWidth,
      height: (el || {}).clientHeight,
    };
  });

  useLayoutEffect(() => {
    const el = getTargetElement(target);
    if (!el) {
      return () => {};
    }

    const resizeObserver = new ResizeObserver((entries: any[]) => {
      entries.forEach(entry => {
        setState({
          width: entry.target.clientWidth,
          height: entry.target.clientHeight,
        });
      });
    });

    resizeObserver.observe(el);
    return () => {
      resizeObserver.disconnect();
    };
  }, [target]);

  return state;
}

export default useSize;
