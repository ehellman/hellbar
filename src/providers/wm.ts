import { useEffect, useRef, useState } from 'react';
import * as zebar from 'zebar';

type WmProvider = 'glazewm' | 'komorebi';

type WmOutputMap = {
  glazewm: zebar.ProviderMap['glazewm']['output'];
  komorebi: zebar.ProviderMap['komorebi']['output'];
};
type WmOutput<T extends WmProvider> = WmOutputMap[T];


function createWorkspaceProvider(workspace: WmProvider) {
  return zebar.createProvider({ type: workspace });
}

export function useWindowManager<T extends WmProvider>(workspace: T = 'glazewm' as T) {
  const providerRef = useRef(createWorkspaceProvider(workspace));
  const [output, setOutput] = useState<WmOutput<T>>(
    providerRef.current.output as WmOutput<T>,
  );

  useEffect(() => {
    providerRef.current.onOutput((output) => setOutput(output as WmOutput<T>));
  }, [workspace]);

  return {
    workspace: output,
    onOutput: providerRef.current.onOutput,
    onError: providerRef.current.onError,
    hasError: providerRef.current.hasError,
    error: providerRef.current.error,
  };
}