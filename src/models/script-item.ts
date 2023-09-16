export type ScriptItem = {
  name: string;
  args: string;
  command: string;
  icon: string;
};

export type HistoryCommandItem = {
  index: number;
  name: string;
  root: string;
  timestamp: number | undefined;
};
