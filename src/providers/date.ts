import { useEffect, useState } from 'react';
import * as zebar from 'zebar';

const dateProvider = zebar.createProvider({ type: 'date', refreshInterval: 1000, formatting: 'HH:mm:ss' });

export function useDate() {
  const [output, setOutput] = useState(
    dateProvider.output,
  );

  useEffect(() => {
    dateProvider.onOutput((output) => setOutput(output));
  }, []);

  return {
    date: output,
    onOutput: dateProvider.onOutput,
    onError: dateProvider.onError,
    hasError: dateProvider.hasError,
    error: dateProvider.error,
  };
}