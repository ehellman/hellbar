import { useCallback, useEffect, useState } from 'react';
import './style.css';
import classnames from 'classnames';

type GraphStyle = 'bar' | 'line';
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

function getColor(value: number, thresholds: GraphThresholds) {
  if (value < thresholds.green.limit) {
    return {
      color: thresholds.green.color || defaultThresholds.green.color,
      opacity: thresholds.green.opacity || defaultThresholds.green.opacity,
    };
  } else if (value < thresholds.yellow.limit) {
    return {
      color: thresholds.yellow.color || defaultThresholds.yellow.color,
      opacity: thresholds.yellow.opacity || defaultThresholds.yellow.opacity,
    };
  } else if (value < thresholds.orange.limit) {
    return {
      color: thresholds.orange.color || defaultThresholds.orange.color,
      opacity: thresholds.orange.opacity || defaultThresholds.orange.opacity,
    };
  } else {
    return {
      color: thresholds.red.color || defaultThresholds.red.color,
      opacity: thresholds.red.opacity || defaultThresholds.red.opacity,
    };
  }
}

export function isAllZeroes(arr: number[]) {
  return arr.every((value) => value === 0);
}

export function useGraphHistory(maxEntries: number) {
  const [graph, setGraph] = useState<number[]>(new Array(maxEntries).fill(0));

  const add = useCallback((entry: number) => {
    setGraph((prevGraph) => {
      if (isAllZeroes(prevGraph)) {
        const nextGraph = [
          ...new Array(maxEntries).fill(entry),
        ];
        return nextGraph;
      } else {
        const nextGraph = [...prevGraph, entry];
        return nextGraph.length > maxEntries ? nextGraph.slice(-maxEntries) : nextGraph;
      }
    });
  }, [maxEntries]);

  return {
    add,
    data: graph,
  };
}

export type GraphSettings = {
  graphStyle?: GraphStyle;
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
  graphStyle,
}: GraphProps) {
  const maxValue = scale ? scale : DEFAULT_MAX_VALUE;

  const [historicMax, setHistoricMax] = useState<number>(maxValue);

  function scaleEntry(entry: number) {
    return (entry / (scaleToHistoricMax ? historicMax : maxValue)) * 100;
  }

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
        const scaledEntry = scaleEntry(entry);

        return graphStyle === 'bar' ? (
          <GraphBar
            key={`${i}-${entry}`}
            entry={scaledEntry}
            historyLength={historyLength}
            thresholds={thresholds}
          />
        ) : (
          <div
            key={`${i}-${entry}`}
            className="graph_line"
            style={{
              height: `${scaledEntry}%`,
              width: `${100 / historyLength}%`,
              ...getColor(scaledEntry, thresholds),
            }}
          >
            <div className="graph_line-bar" />
          </div>
        );
      })}
    </div>
  );
}


type PropType = {
  historyLength: number;
  thresholds: GraphThresholds;
  entry: number;
}

function GraphBar({ entry, historyLength, thresholds }: PropType) {
  return <div
    className="graph_bar"
    style={{
      height: `${entry}%`,
      width: `${100 / historyLength}%`,
      ...getColor(entry, thresholds),
    }}
  />
}