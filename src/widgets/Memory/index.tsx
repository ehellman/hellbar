import './style.css';
import { useEffect, useState } from 'react';
import { useMemory } from '../../providers/memory';
import Graph, { GraphSettings } from '../../components/Graph';

type MemoryGraphWidgetProps = GraphSettings & { maxEntries?: number };

function convertToGB(bytes: number) {
  return Math.round(bytes / 1024 / 1024 / 1024);
}
export default function Memory({ maxEntries = 10,thresholds, graphStyle }: MemoryGraphWidgetProps) {
  const [graph, setGraph] = useState<number[]>(new Array(maxEntries).fill(0));
  const { memory, onOutput } = useMemory();

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
  
  return memory ? (
    <div id="widget_memory">
      <div className="memory-tooltip">
        <div className="memory-usage">
        <span>{convertToGB(memory.usedMemory)}GB</span>
        <span>{convertToGB(memory.totalMemory)}GB</span>
          
          </div>
      </div>

      <Graph entries={graph} historyLength={maxEntries} thresholds={thresholds} graphStyle={graphStyle} />
    </div>
  ) : null;
}
