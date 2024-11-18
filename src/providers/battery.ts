import { useEffect, useState } from 'react';
import * as zebar from 'zebar';

const batteryProvider = zebar.createProvider({ type: 'battery' });

export function useBattery() {
  const [output, setOutput] = useState(
    batteryProvider.output,
  );

  useEffect(() => {
    batteryProvider.onOutput((output) => setOutput(output));
  }, []);

  return {
    battery: output,
    onOutput: batteryProvider.onOutput,
    onError: batteryProvider.onError,
    hasError: batteryProvider.hasError,
    error: batteryProvider.error,
  };
}