import { useEffect, useRef, useState } from 'react';
import * as zebar from 'zebar';

type WmProvider = 'glazewm' | 'komorebi';

type WmOutputMap = {
  glazewm: zebar.ProviderMap['glazewm']['output'];
  komorebi: zebar.ProviderMap['komorebi']['output'];
};
type WmOutput<T extends WmProvider> = WmOutputMap[T];

const providers = zebar.createProviderGroup({ glazewm: { type: 'glazewm' }, komorebi: { type: 'komorebi' } });

function createWorkspaceProvider<T extends WmProvider>(workspace: T = 'glazewm' as T) {
  return {
    provider: providers.outputMap[workspace],
    onOutput: (callback: (outputMap: WmOutput<T>) => void) => providers.onOutput(outputMap => {
      return callback(outputMap[workspace]);
    }),
  }

}

export function useWindowManager<T extends WmProvider>(workspace: T = 'glazewm' as T) {
  const providerRef = useRef(createWorkspaceProvider(workspace));
  const [output, setOutput] = useState<WmOutput<T>>(
    providerRef?.current.provider as WmOutput<T>,
  );

  useEffect(() => {
    if (providerRef.current) {

      providerRef.current.onOutput((output) => setOutput(output as WmOutput<T>));
    }
  }, [workspace]);

  return {
    workspace: output,
    onOutput: providerRef.current.onOutput,
  };
}