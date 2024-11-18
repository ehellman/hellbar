import './style.css';
import { useEffect } from 'react';
import { useMemory } from '../../providers/memory';
import Graph, { GraphSettings, useGraphHistory } from '../../components/Graph';

type MemoryGraphWidgetProps = GraphSettings & { maxEntries?: number };

function convertToGB(bytes: number) {
  return Math.round(bytes / 1024 / 1024 / 1024);
}
export default function Memory({ maxEntries = 10,thresholds, graphStyle }: MemoryGraphWidgetProps) {
  const { add, data } = useGraphHistory(maxEntries);
  const { memory, onOutput } = useMemory();

  useEffect(() => {
    onOutput((output) => {
      add(Math.round(output?.usage));
    });
  }, [add, maxEntries, onOutput]);
  
  return memory ? (
    <div id="widget_memory">
      <div className="memory-tooltip">
        <div className="memory-usage">
        <span>{convertToGB(memory.usedMemory)}GB</span>
        <span>{convertToGB(memory.totalMemory)}GB</span>
          
          </div>
      </div>

      <Graph entries={data} historyLength={maxEntries} thresholds={thresholds} graphStyle={graphStyle} />
    </div>
  ) : null;
}
