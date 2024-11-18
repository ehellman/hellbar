import { useEffect, useState } from 'react';
import * as zebar from 'zebar';

const providers = zebar.createProviderGroup({
  network: { type: 'network' },
  glazewm: { type: 'glazewm' },
  cpu: { type: 'cpu' },
  date: { type: 'date', formatting: 'EEE d MMM t' },
  battery: { type: 'battery' },
  memory: { type: 'memory' },
  weather: { type: 'weather' },
});

let errorCount = 0;

export function useZebar() {
  const [output, setOutput] = useState(providers.outputMap);

  useEffect(() => {
    providers.onOutput(setOutput);
    providers.onError((err) => {
      console.log("------------------------");
      console.log("Error in useZebar, count: ", errorCount, " Error: ", err);
      errorCount++;
      // if (errorCount > 10) {
      //   console.error('Too many errors, stopping provider group');
      //   providers.stop();
      // }
    });
  }, []);

  return output;
}
