import './style.css';
import { useEffect, useState } from 'react';
import Graph, { isAllZeroes } from '../../components/Graph';
import type { BatteryOutput } from 'zebar';
import { useBattery } from '../../providers/battery';
import classnames from 'classnames';

function BatteryIcon({
  state,
  chargeLevel,
}: {
  state: BatteryOutput['state'] | undefined;
  chargeLevel: number | undefined;
}) {
  if (!state) return null;

  function wrap(icon: string, warning: boolean = false) {
    return <span className={classnames('icon', { warning })}>{icon}</span>;
  }

  const defaultDischarging = wrap('󰂌');

  switch (state) {
    case 'empty':
      return wrap('');
    case 'discharging':
      if (!chargeLevel) return defaultDischarging;
      if (chargeLevel > 90) {
        return wrap('󰂂');
      } else if (chargeLevel > 80) {
        return wrap('󰂁');
      } else if (chargeLevel > 70) {
        return wrap('󰂀');
      } else if (chargeLevel > 60) {
        return wrap('󰁿');
      } else if (chargeLevel > 50) {
        return wrap('󰁾');
      } else if (chargeLevel > 40) {
        return wrap('󰁽');
      } else if (chargeLevel > 30) {
        return wrap('󰁼');
      } else if (chargeLevel > 20) {
        return wrap('󰁻');
      } else if (chargeLevel > 15) {
        return wrap('󰁺');
      } else {
        return wrap('󰂃', true);
      }
    case 'charging':
      return wrap('󰂄');
    case 'full':
      // return wrap('󰁹');
      return wrap('');
    default:
      return null;
  }
}

export default function Battery({ maxEntries }: { maxEntries: number }) {
  const { battery } = useBattery();
  // const [received, setReceived] = useState<number[]>(new Array(10).fill(0));
  const [chargeHistory, setChargeHistory] = useState<number[]>(
    new Array(maxEntries).fill(0),
  );
  // function handleClick() {
  //   setDisplayMode((prevMode) =>
  //     prevMode === DisplayMode.Connection
  //       ? DisplayMode.Address
  //       : DisplayMode.Connection,
  //   );
  // }

  useEffect(() => {
    if (battery?.chargePercent) {
      setChargeHistory((prevGraph) => {
        if (isAllZeroes(prevGraph)) {
          const nextGraph = [
            ...new Array(maxEntries).fill(battery.chargePercent),
          ];
          return nextGraph;
        } else {
          const nextGraph = [...prevGraph, battery.chargePercent];
          return nextGraph.length > 10 ? nextGraph.slice(-10) : nextGraph;
        }
      });
    }
  }, [battery?.chargePercent, maxEntries]);

  return battery ? (
    <div
      id="widget_battery"
      // onClick={handleClick}
    >
      <BatteryIcon state={battery.state} chargeLevel={battery.chargePercent} />
      {battery.chargePercent && (
        <>
          {battery.chargePercent < 100 && <span>{Math.round(battery.chargePercent)}%</span>}

          {battery.state === 'discharging' ? (
            <Graph
              entries={chargeHistory}
              historyLength={maxEntries}
              scaleToHistoricMax
              thresholds={{
                green: { limit: 20, color: 'var(--green)', opacity: 0.4 },
                yellow: { limit: 40, color: 'var(--green)', opacity: 0.6 },
                orange: { limit: 60, color: 'var(--green)', opacity: 0.8 },
                red: { color: 'var(--green)', opacity: 1 },
              }}
            />
          ) : null}
        </>
      )}
    </div>
  ) : null;
}
