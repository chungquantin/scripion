import { create } from 'zustand';

import { HistoryCommandItem, ScriptItem } from '../models';

export type Workspace = { id: string; path: string; scripts: ScriptItem[]; name: string };

export interface ScriptManagerStoreState {
  selectedHistoryDirectory: string | undefined;
  selectedWorkspace: string | undefined;
  homeDirectoryPath: string;
  shellDirectoryPath: string;
  workspaces: Record<string, Workspace>;
  historyRecords: Record<string, HistoryCommandItem[]>;
  systemScritps: ScriptItem[];
  setWorkspaces: (workspaces: Record<string, Workspace>) => void;
  addWorkspace: (
    workspaceId: string,
    workspaceName: string,
    path: string,
    scripts: ScriptItem[]
  ) => void;
  removeWorkspace: (workspaceId: string) => void;
  selectWorkspace: (workspaceName: string | undefined) => void;
  setHistoryRecords: (historyRecords: Record<string, HistoryCommandItem[]>) => void;
  setSelectedHistoryDirectory: (directoryName: string | undefined) => void;
  setSystemScripts: (scripts: ScriptItem[]) => void;
  setHomeDirectoryPath: (path: string) => void;
  setShellDirectoryPath: (path: string) => void;
}

export const useScriptManagerStore = create<ScriptManagerStoreState>()(set => ({
  selectedHistoryDirectory: undefined,
  selectedWorkspace: undefined,
  homeDirectoryPath: '',
  shellDirectoryPath: '',
  historyRecords: {},
  systemScritps: [],
  workspaces: {},
  setWorkspaces(workspaces: Record<string, Workspace>) {
    set(state => ({
      ...state,
      workspaces,
    }));
  },
  removeWorkspace(workspaceId: string) {
    set(state => {
      delete state.workspaces[workspaceId];
      return state;
    });
  },
  selectWorkspace(workspaceName: string | undefined) {
    set(state => ({
      ...state,
      selectedWorkspace: workspaceName,
    }));
  },
  setSelectedHistoryDirectory(directoryName) {
    set(state => ({
      ...state,
      selectedHistoryDirectory: directoryName,
    }));
  },
  addWorkspace(workspaceId: string, workspaceName: string, path: string, scripts: ScriptItem[]) {
    set(state => ({
      ...state,
      workspaces: {
        ...state.workspaces,
        [workspaceId]: {
          id: workspaceId,
          name: workspaceName,
          path,
          scripts,
        },
      },
    }));
  },
  setSystemScripts: (scripts: ScriptItem[]) => {
    set(state => ({
      ...state,
      scripts,
    }));
  },
  setHistoryRecords: (historyRecords: Record<string, HistoryCommandItem[]>) => {
    set(state => ({
      ...state,
      historyRecords,
    }));
  },
  setHomeDirectoryPath(path) {
    set(state => ({
      ...state,
      homeDirectoryPath: path,
    }));
  },
  setShellDirectoryPath(path) {
    set(state => ({
      ...state,
      shellDirectoryPath: path,
    }));
  },
}));
