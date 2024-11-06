import { useEffect, useState } from 'react';
import * as zebar from 'zebar';

const cpuProvider = zebar.createProvider({ type: 'cpu' });

export function useCpu() {
  const [output, setOutput] = useState(
    cpuProvider.output,
  );

  useEffect(() => {
    cpuProvider.onOutput((output) => setOutput(output));
  }, []);

  return {
    cpu: output,
    onOutput: cpuProvider.onOutput,
    onError: cpuProvider.onError,
    hasError: cpuProvider.hasError,
    error: cpuProvider.error,
  };
}