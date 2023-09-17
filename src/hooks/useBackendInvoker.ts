/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react';

import { invoke } from '@tauri-apps/api';

import { ScriptItem } from '../models';
import { Workspace } from '../stores';
import { formatCommandOutput, iterateObject } from '../utils';

export const useBackendInvoker = () => {
  const handleInvoke = async <T>(command: string, args?: any) => {
    try {
      const output = await invoke<T>(command, args);
      return output;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const handleGetShellPath = async () => {
    return handleInvoke<string>('get_shell_path');
  };

  const handleExecuteCommand = async (command: string): Promise<string> => {
    const base64Output = await handleInvoke<string>('execute_command', { command });
    return atob(formatCommandOutput(base64Output)).trim();
  };

  const handleOpenFolder = async (folderPath: string) => {
    await handleExecuteCommand(`open ${folderPath}`);
  };

  const handleOpenTerminalAndExecuteCommand = useCallback((command: string) => {
    const script = `osascript -e 'tell application "Terminal" to do script "${command}"' > /dev/null`;
    return handleExecuteCommand(script);
  }, []);

  const handleAddWorkspace = async (name: string, path: string) => {
    return handleInvoke('add_workspace', { name, path });
  };

  const handleFindWorkspaceScripts = async (path: string) => {
    // Javascript, NodeJS integration
    const data = await handleExecuteCommand(`cat ${path}/package.json`);
    const jsonData = JSON.parse(data);

    const scriptItems: ScriptItem[] = [];
    iterateObject(jsonData['scripts'], (key, value: string) =>
      scriptItems.push({
        command: value,
        icon: '',
        name: key,
      })
    );
    return scriptItems;
  };

  const handleGetAllWorkspaces = async () => {
    const workspaces: Workspace[] = [];
    const data: Omit<Workspace, 'scripts'>[] = await handleInvoke('get_all_workspaces');
    for (const workspace of data) {
      const scripts = await handleFindWorkspaceScripts(workspace.path);
      workspaces.push({
        path: workspace.path,
        name: workspace.name,
        id: workspace.id,
        scripts: scripts,
      });
    }
    return workspaces;
  };

  return {
    handleInvoke,
    handleGetShellPath,
    handleExecuteCommand,
    handleOpenFolder,
    handleOpenTerminalAndExecuteCommand,
    handleAddWorkspace,
    handleFindWorkspaceScripts,
    handleGetAllWorkspaces,
  };
};
