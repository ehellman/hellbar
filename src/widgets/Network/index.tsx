import './style.css';
import { useEffect, useState } from 'react';
import { useNetwork } from '../../providers/network';
import type { InterfaceType as NetworkInterfaceType } from 'zebar';
import Graph from '../../components/Graph';

const enum DisplayMode {
  Connection = 0,
  Address = 1,
}

function NetworkIcon({ type }: { type: NetworkInterfaceType | undefined }) {
  if (!type) return null;
  function wrap(icon: string) {
    return <span className="icon">{icon}</span>
  }
  switch (type) {
    case 'ethernet':
      return wrap('🌐');
    case 'wifi':
      return wrap('');
    default:
      return null;
  }
}

export default function Network({ maxEntries }: { maxEntries: number }) {
  const [displayMode, setDisplayMode] = useState<DisplayMode>(
    DisplayMode.Connection,
  );
  console.log({ displayMode }) // delete this after debug

  const { network } = useNetwork();
  const [received, setReceived] = useState<number[]>(new Array(10).fill(0));
  const [transmitted, setTransmitted] = useState<number[]>(
    new Array(10).fill(0),
  );
  // const isConnected = !!network?.defaultInterface?.ipv4Addresses?.length;

  function handleClick() {
    setDisplayMode((prevMode) =>
      prevMode === DisplayMode.Connection
        ? DisplayMode.Address
        : DisplayMode.Connection,
    );
  }

  useEffect(() => {
    if (network?.traffic) {
      setReceived((prevGraph) => {
        const nextGraph = [...prevGraph, network.traffic!.received.bytes];
        return nextGraph.length > 10 ? nextGraph.slice(-10) : nextGraph;
      });
      setTransmitted((prevGraph) => {
        const nextGraph = [...prevGraph, network.traffic!.transmitted.bytes];
        return nextGraph.length > 10 ? nextGraph.slice(-10) : nextGraph;
      });
    }
  }, [network?.traffic]);

      // <span>
      //   {displayMode === DisplayMode.Connection
      //     ? network.defaultInterface?.friendlyName
      //     : network.defaultInterface?.ipv4Addresses[0].split('/')[0]}
      // </span>
  return network ? (
    <div id="widget_network" onClick={handleClick}>
      <NetworkIcon type={network.defaultInterface?.type} />
      {network.traffic && (
        <>
          <div className="graphs">
            <span className={['kB', 'B'].includes(network.traffic.received.siUnit) ? 'low' : ''}>
              {Math.round(network.traffic.received.siValue)}
              {network.traffic.received.siUnit}
            </span>
            <span className={['kB', 'B'].includes(network.traffic.transmitted.siUnit) ? 'low' : ''}>
              {Math.round(network.traffic.transmitted.siValue)}
              {network.traffic.transmitted.siUnit}
            </span>
          </div>
          <div className="graphs">
            <Graph
              entries={received}
              historyLength={maxEntries}
              scaleToHistoricMax
              thresholds={{
                green: { limit: 20, color: 'var(--sapphire)', opacity: 0.4 },
                yellow: { limit: 40, color: 'var(--sapphire)', opacity: 0.6 },
                orange: { limit: 60, color: 'var(--sapphire)', opacity: 0.8 },
                red: { color: 'var(--sapphire)', opacity: 1 },
              }}
              flipped
            />
            <Graph
              entries={transmitted}
              historyLength={maxEntries}
              scaleToHistoricMax
              thresholds={{
                green: { limit: 20, color: 'var(--green)', opacity: 0.4 },
                yellow: { limit: 40, color: 'var(--green)', opacity: 0.6 },
                orange: { limit: 60, color: 'var(--green)', opacity: 0.8 },
                red: { color: 'var(--green)', opacity: 1 },
              }}
            />
          </div>
        </>
      )}
    </div>
  ) : null;
}
