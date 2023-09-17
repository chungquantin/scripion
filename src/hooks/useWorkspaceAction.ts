import { open } from '@tauri-apps/api/dialog';
import { appConfigDir } from '@tauri-apps/api/path';

import { useBackendInvoker } from '.';
import { ScriptItem } from '../models';
import { useScriptManagerStore, useSnackbarStore } from '../stores';
import { iterateObject, makeid } from '../utils';

export const useWorkspaceAction = () => {
  const { enqueueNotification } = useSnackbarStore();
  const { handleExecuteCommand } = useBackendInvoker();
  const { addWorkspace, selectWorkspace } = useScriptManagerStore();

  const handleImportWorkspace = async () => {
    try {
      // Import existing workspace
      const selected = await open({
        directory: true,
        multiple: false,
        title: 'Import Workspace',
        defaultPath: await appConfigDir(),
      });
      if (typeof selected === 'string') {
        // Javascript, NodeJS integration
        const data = await handleExecuteCommand(`cat ${selected}/package.json`);
        const jsonData = JSON.parse(data);

        const workspaceName = jsonData['name'] || selected;
        selectWorkspace(workspaceName);
        const scriptItems: ScriptItem[] = [];
        iterateObject(jsonData['scripts'], (key, value: string) =>
          scriptItems.push({
            command: value,
            icon: '',
            name: key,
          })
        );
        addWorkspace(makeid(5), workspaceName, selected, scriptItems);
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

  return {
    handleImportWorkspace,
    handleCreateNewWorkspace,
  };
};
