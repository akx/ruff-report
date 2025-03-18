import React from "react";

export function useInterval(fn: () => void, interval: number | null) {
  const intervalRef = React.useRef<number>(undefined);
  const fnRef = React.useRef(fn);
  fnRef.current = fn;
  React.useEffect(() => {
    if (interval && interval > 0) {
      intervalRef.current = setInterval(() => {
        fnRef.current?.();
      }, interval);
      return () => {
        clearInterval(intervalRef.current);
      };
    }
    return;
  }, [interval]);
}
