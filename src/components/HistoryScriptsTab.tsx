/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react';
import { GoArrowDown } from 'react-icons/go';

import { Button } from 'antd';

import { MIDDLE_STYLE } from '../constants/style';
import { useBackendInvoker } from '../hooks';
import { HistoryCommandItem } from '../models';
import { useScriptManagerStore } from '../stores';
import { parseOmzHistoryLine } from '../utils';
import HistoryCommandListItem from './HistoryCommandListItem';
import LoadableContainer from './LoadableContainer';

const PAGE_SIZE = 100;

const HistoryScriptsTab = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const { homeDirectoryPath, historyRecords, selectedHistoryDirectory, setHistoryRecords } =
    useScriptManagerStore();
  const { handleExecuteCommand } = useBackendInvoker();

  const handleLoadMorePages = () => {
    setCurrentPage(page => page + 1);
  };

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const historyDirs: string[] = [];
        const homeDirItems = await handleExecuteCommand(`ls -a ${homeDirectoryPath}`);
        for (const item of homeDirItems.split('\n')) {
          if (item.includes('_history')) {
            historyDirs.push(item);
          }
        }

        const _historyRecords: Record<string, HistoryCommandItem[]> = {};
        for (const historyDir of historyDirs) {
          const filePath = `${homeDirectoryPath}/${historyDir}`;
          const items = await handleExecuteCommand(`cat ${filePath}`);
          for (const item of items.split('\n')) {
            if (historyDir === '.zsh_history') {
              const parsedLine = parseOmzHistoryLine(item);
              if (!parsedLine) continue;
              const { command, timestamp } = parsedLine;
              _historyRecords[historyDir] = _historyRecords[historyDir]
                ? _historyRecords[historyDir].concat({
                    index: _historyRecords[historyDir].length + 1,
                    name: command,
                    root: historyDir,
                    timestamp: timestamp,
                  })
                : [];
            } else {
              _historyRecords[historyDir] = _historyRecords[historyDir]
                ? _historyRecords[historyDir].concat({
                    index: _historyRecords[historyDir].length + 1,
                    name: item,
                    root: historyDir,
                    timestamp: undefined,
                  })
                : [];
            }
          }
        }
        setHistoryRecords(_historyRecords);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    init();
  }, [homeDirectoryPath]);

  const sortedSelectedHistoryRecords = useMemo(
    () =>
      selectedHistoryDirectory
        ? historyRecords[selectedHistoryDirectory].sort(
            (recordA, recordB) => (recordB.timestamp || 0) - (recordA.timestamp || 0)
          )
        : [],
    [historyRecords, selectedHistoryDirectory]
  );

  const currentHistoryRecords = useMemo(
    () => sortedSelectedHistoryRecords.slice(0, (currentPage + 1) * PAGE_SIZE),
    [currentPage, sortedSelectedHistoryRecords]
  );

  return (
    <div>
      <LoadableContainer isLoading={loading} loadComponent={<div>Loading...</div>}>
        {selectedHistoryDirectory ? (
          <React.Fragment>
            {currentHistoryRecords.map(item => (
              <HistoryCommandListItem item={item} />
            ))}
          </React.Fragment>
        ) : (
          <div>No directory selected</div>
        )}
        {currentHistoryRecords.length !== sortedSelectedHistoryRecords.length && (
          <div style={{ ...MIDDLE_STYLE }}>
            <Button
              onClick={handleLoadMorePages}
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                margin: '10px 0px',
                ...MIDDLE_STYLE,
              }}>
              <GoArrowDown style={{ marginRight: 10 }} /> Load more commands
            </Button>
          </div>
        )}
      </LoadableContainer>
    </div>
  );
};

export default HistoryScriptsTab;
