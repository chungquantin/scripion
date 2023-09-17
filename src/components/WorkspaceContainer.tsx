import { useState } from 'react';

import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { open } from '@tauri-apps/api/dialog';
import { appConfigDir } from '@tauri-apps/api/path';
import { Button, Space } from 'antd';

import { MIDDLE_STYLE } from '../constants/style';
import { useBackendInvoker } from '../hooks';
import { ScriptItem } from '../models';
import { useScriptManagerStore, useSnackbarStore } from '../stores';
import { countObjectItems, iterateObject } from '../utils';
import ScriptItemList from './ScriptItemList';

const WorkspaceContainer = () => {
  const [selectedScript, setSelectedScript] = useState<ScriptItem | undefined>(undefined);

  const { enqueueNotification } = useSnackbarStore();
  const { handleExecuteCommand } = useBackendInvoker();
  const { workspaces } = useScriptManagerStore();

  const [selectedFile, setSelectedFile] = useState<string | undefined>(undefined);
  const [selectedFileScripts, setSelectedFileScripts] = useState<ScriptItem[]>([]);

  const handleImportWorkspace = async () => {
    try {
      // Import existing workspace
      const selected = await open({
        directory: false,
        multiple: false,
        title: 'Import Workspace',
        defaultPath: await appConfigDir(),
      });
      if (typeof selected === 'string' && selected?.includes('package.json')) {
        setSelectedFile(selected);
        const data = await handleExecuteCommand(`cat ${selected}`);
        const jsonData = JSON.parse(data);

        const scriptItems: ScriptItem[] = [];
        iterateObject(jsonData['scripts'], (key, value: string) =>
          scriptItems.push({
            command: value,
            icon: '',
            name: key,
          })
        );
        setSelectedFileScripts(scriptItems);
      } else {
        throw new Error('Invalid file format');
      }
    } catch (error) {
      enqueueNotification({
        name: `Error: ${error}`,
        description: 'Error',
        type: 'Error',
      });
    }
  };

  const handleCreateNewWorkspace = () => {
    // Add new workspace
  };

  return (
    <div>
      {countObjectItems(workspaces).length === 0 && (
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
            <UploadOutlined style={{ marginRight: 10 }} /> Import configuration file
          </Button>
          <p>package.json</p>

          {selectedFile}
          <ScriptItemList
            scripts={selectedFileScripts}
            handleSelectScriptItem={setSelectedScript}
            selectedScript={selectedScript}
          />
        </Space>
      )}
    </div>
  );
};

export default WorkspaceContainer;
