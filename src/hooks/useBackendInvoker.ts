import { invoke } from '@tauri-apps/api';

import { formatCommandOutput } from '../utils';

export const useBackendInvoker = () => {
  const handleInvoke = async (command: string, args?: any) => {
    try {
      const output = await invoke<string>(command, args);
      return output;
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const handleGetShellPath = async () => {
    return handleInvoke('get_shell_path');
  };

  const handleExecuteCommand = async (command: string): Promise<string> => {
    const base64Output = await handleInvoke('execute_command', { command });
    return atob(formatCommandOutput(base64Output)).trim();
  };

  const handleOpenFolder = async (folderPath: string) => {
    await handleExecuteCommand(`open ${folderPath}`);
  };

  return {
    handleInvoke,
    handleGetShellPath,
    handleExecuteCommand,
    handleOpenFolder,
  };
};
