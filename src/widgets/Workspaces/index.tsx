import './style.css';
import classnames from 'classnames';
import { useWindowManager } from '../../providers/wm';
import * as glazewm from 'glazewm';
import React from 'react';

function convertToPercentage(value: number, of: number) {
  return (value / of) * 100;
}

type WorkspaceWindowPropType = {
  child: glazewm.Window;
  ws: glazewm.Workspace;
};

function WorkspaceWindow({ child, ws }: WorkspaceWindowPropType) {
  const style: Partial<Record<glazewm.WindowType, React.CSSProperties>> = {
    [glazewm.WindowType.TILING]: {
      flexBasis:
        (child.tilingSize && Math.round(child.tilingSize * 100)) + '%' ||
        child.width + '%',
    },
    [glazewm.WindowType.FLOATING]: {
      position: 'absolute',
      left: `${convertToPercentage(child.x, ws.width)}%`,
      top: `${convertToPercentage(child.y, ws.height)}%`,
      width: `${convertToPercentage(child.width, ws.width)}%`,
      height: `${convertToPercentage(child.height, ws.height)}%`,
    },
    [glazewm.WindowType.FULLSCREEN]: {},
    [glazewm.WindowType.MINIMIZED]: {},
  };

  return (
    <div
      className={classnames('workspace_window', {
        focused: child.hasFocus,
        fullscreen: child.state.type === glazewm.WindowType.FULLSCREEN,
      })}
      style={{
        ...style[child.state.type],
      }}
    >
      {child.state.type === glazewm.WindowType.FULLSCREEN ? (<>
        <span>󰁛</span><span>󰁜</span><span>󰁂</span><span>󰁃</span>
      </>) : null}
    </div>
  );
}

function renderChild(
  child: glazewm.Window | glazewm.SplitContainer,
  ws: glazewm.Workspace,
) {
  switch (child.type) {
    case glazewm.ContainerType.WINDOW:
      switch (child.state.type) {
        case glazewm.WindowType.TILING:
          return <WorkspaceWindow key={child.id} child={child} ws={ws} />;
        case glazewm.WindowType.FLOATING:
          return <WorkspaceWindow key={child.id} child={child} ws={ws} />;
        case glazewm.WindowType.FULLSCREEN:
          return <WorkspaceWindow key={child.id} child={child} ws={ws} />;
        case glazewm.WindowType.MINIMIZED:
          // minimized windows are handled elsewhere
          return null;
        default:
          return null;
      }

    case glazewm.ContainerType.SPLIT:
      return (
        <div
          className={classnames('workspace_split')}
          style={{
            flexBasis:
              (child.tilingSize && Math.round(child.tilingSize * 100)) + '%' ||
              child.width + '%',
            flexDirection:
              child.tilingDirection === glazewm.TilingDirection.HORIZONTAL
                ? 'row'
                : 'column',
          }}
        >
          {child.children.map((splitChild) => {
            return renderChild(splitChild, ws);
          })}
        </div>
      );
    default:
      return <div>ERR</div>;
  }
}

export default function Workspaces() {
  const { workspace } = useWindowManager('glazewm');

  function changeWorkspace(ws: string) {
    workspace?.runCommand(`focus --workspace ${ws}`);
  }
  
  return (
    <div id="widget_workspace">
      {workspace?.allWorkspaces.map((ws) => {
        const { minimizedWindows, visibleContainers } = ws.children.reduce<{
          minimizedWindows: glazewm.Window[];
          visibleContainers: (glazewm.Window | glazewm.SplitContainer)[];
        }>(
          (acc, child) => {
            if (child.type === glazewm.ContainerType.WINDOW) {
              if (child.state.type === glazewm.WindowType.MINIMIZED) {
                acc.minimizedWindows.push(child);
              } else {
                acc.visibleContainers.push(child);
              }
            } else {
              // non-window content goes to visible
              acc.visibleContainers.push(child);
            }
            return acc;
          },
          { minimizedWindows: [], visibleContainers: [] },
        );

        return (
          <div
            key={ws.name}
            className={classnames('workspace_display', {
              focused: ws.hasFocus,
            })}
            data-tiling-direction={ws.tilingDirection}
            onClick={() => changeWorkspace(ws.name)}
          >
            {minimizedWindows.length ? (
              <aside className="workspace_minimized">
                {minimizedWindows.map((child) => {
                  return (
                    <div
                      key={child.id}
                      className={classnames('workspace_minimized-window', {
                        focused: ws.hasFocus,
                      })}
                    />
                  );
                })}
              </aside>
            ) : null}
            {visibleContainers.map((child) => {
              return renderChild(child, ws);
            })}
          </div>
        );
      })}
    </div>
  );
}
