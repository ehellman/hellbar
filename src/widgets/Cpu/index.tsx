import './style.css';
import { useCpu } from '../../providers/cpu';
import { useEffect } from 'react';
import Graph, { GraphSettings, useGraphHistory } from '../../components/Graph';

type CpuPropType = GraphSettings & { maxEntries?: number };

export default function Cpu({ maxEntries = 10, thresholds, graphStyle }: CpuPropType) {
  // const [graph, setGraph] = useState<number[]>(new Array(maxEntries).fill(0));
  const { cpu, onOutput } = useCpu();
  const { add, data } = useGraphHistory(maxEntries);

  useEffect(() => {
    onOutput((output) => {
      add(Math.round(output.usage));
      // setChargeHistory((prevGraph) => {
      //   if (isAllZeroes(prevGraph)) {
      //     const nextGraph = [
      //       ...new Array(maxEntries).fill(battery.chargePercent),
      //     ];
      //     return nextGraph;
      //   } else {
      //     const nextGraph = [...prevGraph, battery.chargePercent];
      //     return nextGraph.length > 10 ? nextGraph.slice(-10) : nextGraph;
      //   }
      // });
      // setGraph((prevGraph) => {
      //   const nextGraph = [...prevGraph, Math.round(output.usage)];
      //   // trim the graph to the last maxEntries, keeping the most recent
      //   return nextGraph.length > maxEntries
      //     ? nextGraph.slice(-maxEntries)
      //     : nextGraph;
      // });
    });
  }, [add, maxEntries, onOutput]);

  return cpu ? (
    <div id="widget_cpu">
      <div className="cpu-tooltip">
        <div className="cpu-usage">{Math.round(cpu?.usage)}%</div>
      </div>

      <Graph entries={data} historyLength={maxEntries} thresholds={thresholds} graphStyle={graphStyle} />
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
