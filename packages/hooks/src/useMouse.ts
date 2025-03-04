import { useState } from 'react';
import { throttle } from '@acme/utils/throttle';
import useEventListener from './useEventListener';

const initState = {
  screenX: NaN,
  screenY: NaN,
  clientX: NaN,
  clientY: NaN,
  pageX: NaN,
  pageY: NaN,
};

const useMouse = ({ interval = 800 }) => {
  const [state, setState] = useState(initState);

  const handleMouseMove = throttle((event: MouseEvent) => {
    if (event !== undefined && event !== null) {
      const { screenX, screenY, clientX, clientY, pageX, pageY } = event;
      setState({ screenX, screenY, clientX, clientY, pageX, pageY });
    }
  }, interval);

  useEventListener('mousemove', (event: MouseEvent) => handleMouseMove(event), {
    target: document,
  });

  return state;
};

export default useMouse;
