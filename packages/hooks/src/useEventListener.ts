import { useEffect, useRef } from 'react';
import { getTargetElement } from './utils/dom';

function useEventListener(
  eventName: string,
  handler: (event: MouseEvent) => any,
  options: { target: any; capture?: boolean; once?: boolean; passive?: boolean },
) {
  const handlerRef = useRef<any>();
  handlerRef.current = handler;

  useEffect(() => {
    const targetElement = getTargetElement(options.target, window);
    if (!targetElement.addEventListener) {
      return;
    }

    const eventListener = (event: MouseEvent) => {
      return handlerRef.current && handlerRef.current(event);
    };

    targetElement.addEventListener(eventName, eventListener, {
      capture: options.capture,
      once: options.once,
      passive: options.passive,
    });

    // eslint-disable-next-line consistent-return
    return () => {
      targetElement.removeEventListener(eventName, eventListener, {
        capture: options.capture,
      });
    };
  }, [eventName, options.target, options.capture, options.once, options.passive]);
}

export default useEventListener;
