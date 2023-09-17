/* eslint-disable no-useless-escape */
import React, { useMemo, useState } from 'react';

import { DeleteOutlined, PlusOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Divider, Input, Space } from 'antd';
import Fuse from 'fuse.js';

import { STRIPE_BOX_SHADOW } from '../constants';
import { MIDDLE_STYLE } from '../constants/style';
import { useBackendInvoker } from '../hooks';
import { useWorkspaceAction } from '../hooks/useWorkspaceAction';
import { ScriptItem } from '../models';
import { useScriptManagerStore } from '../stores';
import ScriptItemList from './ScriptItemList';

const options = { keys: ['name'] };

const WorkspaceContainer = () => {
  const { handleCreateNewWorkspace, handleImportWorkspace } = useWorkspaceAction();
  const { handleOpenTerminalAndExecuteCommand } = useBackendInvoker();
  const [searchInput, setSearchInput] = useState<string>('');
  const { workspaces, selectedWorkspace, removeWorkspace } = useScriptManagerStore();

  const selectedWorkspaceScripts = useMemo(() => {
    return (workspaces[selectedWorkspace || '']?.scripts || []).sort((scriptA, scriptB) =>
      scriptA.name > scriptB.name ? 1 : -1
    );
  }, [workspaces, selectedWorkspace]);

  const fuseSearchInex = useMemo(() => {
    const searchIndex = Fuse.createIndex(options.keys, selectedWorkspaceScripts);
    return searchIndex;
  }, [selectedWorkspaceScripts]);

  const currentHistoryRecords = useMemo(() => {
    const fuse = new Fuse(selectedWorkspaceScripts, options, fuseSearchInex);
    const results = fuse.search(searchInput);
    const searchResultItems = results.map(result => result.item);
    return searchResultItems.length > 0 ? searchResultItems : selectedWorkspaceScripts;
  }, [selectedWorkspaceScripts, searchInput, fuseSearchInex]);

  const onSearchInputChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    setSearchInput(e.target.value);
  };

  const handleExecuteScript = async (script: ScriptItem) => {
    // Execute script
    await handleOpenTerminalAndExecuteCommand(
      `cd ${workspaces[selectedWorkspace || ''].path} \n npm run ${script.name}`
    );
  };

  const handleDeleteWorkspace = () => {
    removeWorkspace(selectedWorkspace || '');
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {selectedWorkspace && workspaces[selectedWorkspace || ''] ? (
        <React.Fragment>
          <div
            className="border-bottom search-section"
            style={{
              width: 'calc(100% - 280px)',
              padding: '5px 0px',
              borderRadius: 5,
              position: 'fixed',
              boxShadow: STRIPE_BOX_SHADOW,
              zIndex: 100,
            }}>
            <div style={{ padding: '7px 20px', ...MIDDLE_STYLE, justifyContent: 'space-between' }}>
              <div>
                <h4>{workspaces[selectedWorkspace || '']?.name}</h4>
              </div>
              <Space>
                <DeleteOutlined onClick={handleDeleteWorkspace} />
              </Space>
            </div>
            <Divider style={{ margin: 0 }} />
            <Input
              value={searchInput}
              onChange={onSearchInputChange}
              prefix={<SearchOutlined />}
              placeholder="Search for commands..."></Input>
          </div>
          <div style={{ paddingTop: 90 }}>
            <ScriptItemList
              scripts={currentHistoryRecords}
              handleSelectScriptItem={handleExecuteScript}
            />
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div style={{ ...MIDDLE_STYLE, height: '100%', width: '100%' }}>
            <Space
              style={{
                ...MIDDLE_STYLE,
                flexDirection: 'column',
              }}>
              <div>No workspace found</div>
              <Button
                onClick={handleCreateNewWorkspace}
                style={{
                  backgroundColor: 'transparent',
                  color: 'white',
                  ...MIDDLE_STYLE,
                }}>
                <PlusOutlined style={{ marginRight: 10 }} /> Create new workspace
              </Button>
              <Button
                onClick={handleImportWorkspace}
                style={{
                  backgroundColor: 'transparent',
                  color: 'white',
                  ...MIDDLE_STYLE,
                }}>
                <UploadOutlined style={{ marginRight: 10 }} /> Add workspace
              </Button>
              <p>Support package.json</p>
            </Space>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default WorkspaceContainer;
