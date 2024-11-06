import './style.css';
// import classnames from 'classnames';
import { useWindowManager } from '../../providers/wm';
import * as glazewm from 'glazewm';
import { useDate } from '../../providers/date';

function isWindowContainer(
  container: glazewm.Container | undefined,
): container is glazewm.Window {
  if (!container) {
    return false;
  }
  return container.type === glazewm.ContainerType.WINDOW;
}

function truncate(str: string, n: number = 80) {
    return str.length > n ? str.substring(0, n - 1) + '...' : str;
}

export default function CurrentWindow() {
  const { workspace } = useWindowManager('glazewm');
  const { date } = useDate();
  return (
    <div id="widget_current-window">
      {isWindowContainer(workspace?.focusedContainer) ? truncate(workspace.focusedContainer.title) : date?.formatted}
    </div>
  );
}
