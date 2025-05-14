import { useState } from "react";

interface UseDebounceProps {
  delay: number;
  callback: () => void;
}

/**
 * Delays the execution of a function until a certain amount of time has passed since the last time it was called
 * 
 * @example 
 *  const debounceExecution = useDebounce({
      callback: () => console.log("Executed"), // function to get executed with the delay
      delay: 1000, // in ms
    });

    debounceExecution(); 
 */
export default function useDebounce(props: UseDebounceProps) {
  const { callback, delay } = props;

  const [timedout, setTimedout] = useState<NodeJS.Timeout | null>(null);

  function handleDelayedExecution() {
    if (timedout) {
      clearTimeout(timedout);
    }

    setTimedout(setTimeout(callback, delay));
  }

  return handleDelayedExecution;
}
