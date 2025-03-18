import React from "react";

export function useInterval(fn: () => void, interval: number) {
  const intervalRef = React.useRef<number>(undefined);
  const start = React.useCallback(() => {
    intervalRef.current = setInterval(fn, interval);
  }, [fn, interval]);
  const stop = React.useCallback(() => {
    clearInterval(intervalRef.current);
  }, []);
  React.useEffect(() => {
    return stop;
  }, [stop]);
  return { start, stop };
}
