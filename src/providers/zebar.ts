import { useEffect, useState } from 'react';
import * as zebar from 'zebar';

const providers = zebar.createProviderGroup({
  network: { type: 'network' },
  glazewm: { type: 'glazewm' },
  // cpu: { type: 'cpu' },
  date: { type: 'date', formatting: 'EEE d MMM t' },
  battery: { type: 'battery' },
  memory: { type: 'memory' },
  weather: { type: 'weather' },
});

export function useZebar() {
  const [output, setOutput] = useState(providers.outputMap);

  useEffect(() => {
    providers.onOutput(setOutput);
  }, []);

  return output;
}
