import { useEffect, useState } from 'react';
import * as zebar from 'zebar';

const networkProvider = zebar.createProvider({ type: 'network' });

export function useNetwork() {
  const [output, setOutput] = useState(
    networkProvider.output,
  );

  useEffect(() => {
    networkProvider.onOutput((output) => setOutput(output));
  }, []);

  return {
    network: output,
    onOutput: networkProvider.onOutput,
    onError: networkProvider.onError,
    hasError: networkProvider.hasError,
    error: networkProvider.error,
  };
}