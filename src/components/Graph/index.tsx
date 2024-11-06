import { useEffect, useState } from 'react';
import './style.css';
import classnames from 'classnames';

type GraphThresholds = {
  green: { limit: number; color: string; opacity?: number };
  yellow: { limit: number; color: string; opacity?: number };
  orange: { limit: number; color: string; opacity?: number };
  red: { color: string; opacity?: number };
};

const defaultThresholds: GraphThresholds = {
  green: { limit: 20, color: 'var(--green)', opacity: 1 },
  yellow: { limit: 40, color: 'var(--yellow)', opacity: 1 },
  orange: { limit: 60, color: 'var(--peach)', opacity: 1 },
  red: { color: 'var(--red)', opacity: 1 },
};

function getColor(usage: number, thresholds: GraphThresholds) {
  if (usage < thresholds.green.limit) {
    return {
      backgroundColor: thresholds.green.color || defaultThresholds.green.color,
      opacity: thresholds.green.opacity || defaultThresholds.green.opacity,
    };
  } else if (usage < thresholds.yellow.limit) {
    return {
      backgroundColor: thresholds.yellow.color || defaultThresholds.yellow.color,
      opacity: thresholds.yellow.opacity || defaultThresholds.yellow.opacity,
    };
  } else if (usage < thresholds.orange.limit) {
    return {
      backgroundColor: thresholds.orange.color || defaultThresholds.orange.color,
      opacity: thresholds.orange.opacity || defaultThresholds.orange.opacity,
    };
  } else {
    return {
      backgroundColor: thresholds.red.color || defaultThresholds.red.color,
      opacity: thresholds.red.opacity || defaultThresholds.red.opacity,
    };
  }
}

export type GraphSettings = {
  graphStyle?: 'bar' | 'line';
  scale?: number | undefined | null;
  scaleToHistoricMax?: boolean;
  flipped?: boolean;
  thresholds?: GraphThresholds;
};

type GraphProps = {
  entries: number[];
  historyLength?: number;
} & GraphSettings;

const DEFAULT_MAX_VALUE = 100;

export default function Graph({
  historyLength = 10,
  scale,
  scaleToHistoricMax = false,
  thresholds = defaultThresholds,
  flipped = false,
  entries,
}: GraphProps) {
  const maxValue = scale ? scale : DEFAULT_MAX_VALUE;

  const [historicMax, setHistoricMax] = useState<number>(maxValue);

  useEffect(() => {
    if (!scaleToHistoricMax && maxValue === DEFAULT_MAX_VALUE) return;

    const currentMax = Math.max(...entries);

    if (currentMax > historicMax) {
      setHistoricMax(currentMax);
    }
  }, [maxValue, historicMax, entries, scaleToHistoricMax]);

  return (
    <div
      className={classnames('graph', { flipped })}
      style={{ width: `${(2 * historyLength) / 10}rem` }}
    >
      {entries.map((entry, i) => {
        // scale entry to a 0-100 range
        const scaledEntry =
          (entry / (scaleToHistoricMax ? historicMax : maxValue)) * 100;
        return (
          <div
            key={`${i}-${entry}`}
            className="graph_bar"
            style={{
              height: `${scaledEntry}%`,
              width: `${100 / historyLength}%`,
              ...getColor(scaledEntry, thresholds),
            }}
          />
        );
      })}
    </div>
  );
}
