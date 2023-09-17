import { create } from 'zustand';

import { HistoryCommandItem, ScriptItem } from '../models';

export interface ScriptManagerStoreState {
  selectedHistoryDirectory: string | undefined;
  homeDirectoryPath: string;
  shellDirectoryPath: string;
  workspaces: Record<string, ScriptItem[]>;
  historyRecords: Record<string, HistoryCommandItem[]>;
  systemScritps: ScriptItem[];
  setWorkspaces: (scripts: ScriptItem[]) => void;
  setHistoryRecords: (historyRecords: Record<string, HistoryCommandItem[]>) => void;
  setSelectedHistoryDirectory: (directoryName: string | undefined) => void;
  setSystemScripts: (scripts: ScriptItem[]) => void;
  setHomeDirectoryPath: (path: string) => void;
  setShellDirectoryPath: (path: string) => void;
}

export const useScriptManagerStore = create<ScriptManagerStoreState>()(set => ({
  selectedHistoryDirectory: undefined,
  homeDirectoryPath: '',
  shellDirectoryPath: '',
  historyRecords: {},
  systemScritps: [],
  workspaces: {},
  setSelectedHistoryDirectory(directoryName) {
    set(state => ({
      ...state,
      selectedHistoryDirectory: directoryName,
    }));
  },
  setWorkspaces(scripts: ScriptItem[]) {
    set(state => ({
      ...state,
      scripts,
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
