import './settings/colors.css';
import './settings/spacing.css';
import './Bar.css';
import Date from './widgets/Date';
import Workspaces from './widgets/Workspaces';
import TilingDirection from './widgets/TilingDirection';
import BindingModes from './widgets/BindingModes';
import Cpu from './widgets/Cpu';
import Memory from './widgets/Memory';
import CurrentWindow from './widgets/CurrentWindow';
import Network from './widgets/Network';

function App() {
  return (
    <div id="bar">
      <div id="widgets_left">
        <Workspaces />
      </div>
      <div id="widgets_center">
        <CurrentWindow />
      </div>
      <div id="widgets_right">
        <BindingModes />
        <TilingDirection />
        <Network maxEntries={10} />
        <Cpu maxEntries={10} />
        <Memory maxEntries={10} />
        <Date />
      </div>
    </div>
  );
}

export default App;
