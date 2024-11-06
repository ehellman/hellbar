import { useEffect, useState } from 'react';
import * as zebar from 'zebar';

const memoryProvider = zebar.createProvider({ type: 'memory' });

export function useMemory() {
  const [output, setOutput] = useState(
    memoryProvider.output,
  );

  useEffect(() => {
    memoryProvider.onOutput((output) => setOutput(output));
  }, []);

  return {
    memory: output,
    onOutput: memoryProvider.onOutput,
    onError: memoryProvider.onError,
    hasError: memoryProvider.hasError,
    error: memoryProvider.error,
  };
}