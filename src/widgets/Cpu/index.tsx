import './style.css';
import { useCpu } from '../../providers/cpu';
import { useEffect, useState } from 'react';
import Graph, { GraphSettings } from '../../components/Graph';

type CpuPropType = GraphSettings & { maxEntries?: number };

export default function Cpu({ maxEntries = 10, thresholds, graphStyle }: CpuPropType) {
  const [graph, setGraph] = useState<number[]>(new Array(maxEntries).fill(0));
  const { cpu, onOutput } = useCpu();

  useEffect(() => {
    onOutput((output) => {
      setGraph((prevGraph) => {
        const nextGraph = [...prevGraph, Math.round(output.usage)];
        // trim the graph to the last maxEntries, keeping the most recent
        return nextGraph.length > maxEntries
          ? nextGraph.slice(-maxEntries)
          : nextGraph;
      });
    });
  }, [maxEntries, onOutput]);
  return cpu ? (
    <div id="widget_cpu">
      <div className="cpu-tooltip">
        <div className="cpu-usage">{Math.round(cpu?.usage)}%</div>
      </div>

      <Graph entries={graph} historyLength={maxEntries} thresholds={thresholds} graphStyle={graphStyle} />
{/* 
      <div className="cpu-graph" style={{ width: `${2 * maxEntries / 10}rem`}}>
        {graph.map((entry, i) => (
          <div key={i} className="cpu-graph_bar" style={{ 
            height: `${entry}%`, width: `${100 / maxEntries}%`,
            backgroundColor: getColor(entry, thresholds),
          }}></div>
        ))}
      </div> */}
    </div>
  ) : null;
}
