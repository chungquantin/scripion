/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo } from 'react';
import { GoFileDirectoryFill } from 'react-icons/go';

import { PlusOutlined } from '@ant-design/icons';
import { Space, Tooltip } from 'antd';

import { MIDDLE_STYLE } from '../constants/style';
import { useWorkspaceAction } from '../hooks/useWorkspaceAction';
import { useScriptManagerStore } from '../stores';
import { shortenString } from '../utils';

const WorkspaceListTab = () => {
  const { handleImportWorkspace } = useWorkspaceAction();
  const { selectWorkspace, selectedWorkspace, workspaces } = useScriptManagerStore();

  const workspaceNames = useMemo(
    () =>
      Object.keys(workspaces)
        .sort((nameA, nameB) => (nameA > nameB ? 1 : -1))
        .map(item => item),
    [workspaces]
  );

  useEffect(() => {
    selectWorkspace(workspaceNames.length > 0 ? workspaceNames?.[0] : undefined);
  }, [workspaceNames]);

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <div style={{ fontSize: 'smaller', marginBottom: 10, ...MIDDLE_STYLE }}>
        <div className="sider-button" onClick={handleImportWorkspace}>
          <PlusOutlined />
          Add workspace
        </div>
      </div>
      {workspaceNames.map(item => (
        <div
          onClick={() => selectWorkspace(item)}
          className={
            selectedWorkspace === item
              ? 'history-directory-item-selected'
              : 'history-directory-item'
          }>
          <div style={{ ...MIDDLE_STYLE, justifyContent: 'space-between' }}>
            <div>
              <GoFileDirectoryFill style={{ marginRight: 10 }} />
              {workspaces[item].name}
              <Tooltip title={workspaces[item].path}>
                <div className="history-directory-sub">
                  {shortenString(workspaces[item].path, 30)}
                </div>
              </Tooltip>
            </div>
          </div>
        </div>
      ))}
    </Space>
  );
};

export default WorkspaceListTab;
