import { open } from '@tauri-apps/api/dialog';
import { appConfigDir } from '@tauri-apps/api/path';

import { useBackendInvoker } from '.';
import { ScriptItem } from '../models';
import { Workspace, useScriptManagerStore, useSnackbarStore } from '../stores';
import { makeid } from '../utils';

export const useWorkspaceAction = () => {
  const { enqueueNotification } = useSnackbarStore();
  const {
    handleExecuteCommand,
    handleAddWorkspace,
    handleFindWorkspaceScripts,
    handleGetAllWorkspaces,
  } = useBackendInvoker();
  const { addWorkspace, selectWorkspace, setWorkspaces } = useScriptManagerStore();

  const handleFetchWorkspaces = async () => {
    const workspaceList = await handleGetAllWorkspaces();
    const workspaces: Record<string, Workspace> = {};
    for (const workspaceListItem of workspaceList) {
      workspaces[workspaceListItem.id.toString()] = workspaceListItem;
    }
    setWorkspaces(workspaces);
  };

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
        const scriptItems: ScriptItem[] = await handleFindWorkspaceScripts(selected);
        handleAddWorkspace(workspaceName, selected);
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

  return {
    handleImportWorkspace,
    handleFindWorkspaceScripts,
    handleFetchWorkspaces,
  };
};
