import './style.css';
import { useWindowManager } from '../../providers/wm';
import classnames from 'classnames';
import { useEffect, useRef, useState } from 'react';

export default function TilingDirection() {
  const { workspace } = useWindowManager('glazewm');
  const [active, setActive] = useState(false);
  const activeTimerRef = useRef<number | null>(null);

  function changeTilingDirection() {
    workspace?.runCommand(`toggle-tiling-direction`);
  }

  useEffect(() => { 
    setActive(true);
    activeTimerRef.current = window.setTimeout(() => {
      setActive(false);
      activeTimerRef.current = null;
    }, 2000);
    return () => {
      if (activeTimerRef.current) {
        clearTimeout(activeTimerRef.current);
      }
    };
  }, [workspace?.tilingDirection]);

  return (
    <button
      id="widget_tiling-direction"
      className="tiling-direction_button"
      onClick={() => changeTilingDirection()}
      data-direction={workspace?.tilingDirection}
    >
      <span className={classnames("workspace-button_name", { active })}>
      󰿢
      </span>
    </button>
  );
}
