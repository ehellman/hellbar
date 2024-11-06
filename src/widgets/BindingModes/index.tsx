import './style.css';
import { useWindowManager } from '../../providers/wm';

export default function BindingModes() {
  const { workspace } = useWindowManager('glazewm');

  return workspace?.bindingModes.length ? (
    <div id="widget_binding-modes">
      {workspace.bindingModes.map((bindingMode, i) => (
        <button
          key={i}
          className="workspace-binding-mode"
        >
          <span>{bindingMode.name}</span>
        </button>
      ))}
    </div>
  ) : null;
}
