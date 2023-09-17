/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react';
import { GoArrowDown } from 'react-icons/go';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row } from 'antd';
import Fuse from 'fuse.js';

import { STRIPE_BOX_SHADOW } from '../constants';
import { MIDDLE_STYLE } from '../constants/style';
import { useBackendInvoker } from '../hooks';
import { HistoryCommandItem } from '../models';
import { useScriptManagerStore } from '../stores';
import { parseOmzHistoryLine } from '../utils';
import AnimatedComponent from './AnimatedComponent';
import HistoryCommandListItem from './HistoryCommandListItem';
import LoadableContainer from './LoadableContainer';

const PAGE_SIZE = 100;
const options = { keys: ['name'] };

const HistoryScriptsTab = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [searchInput, setSearchInput] = useState<string>('');
  const { homeDirectoryPath, historyRecords, selectedHistoryDirectory, setHistoryRecords } =
    useScriptManagerStore();
  const { handleExecuteCommand, handleOpenTerminalAndExecuteCommand } = useBackendInvoker();
  const [sortedSelectedHistoryRecords, setSortedSelectedHistoryRecords] = useState<
    HistoryCommandItem[]
  >([]);

  const handleLoadMorePages = () => {
    setCurrentPage(page => page + 1);
  };

  const fuseSearchInex = useMemo(() => {
    const searchIndex = Fuse.createIndex(options.keys, sortedSelectedHistoryRecords);
    return searchIndex;
  }, [sortedSelectedHistoryRecords]);

  const currentHistoryRecords = useMemo(() => {
    const fuse = new Fuse(sortedSelectedHistoryRecords, options, fuseSearchInex);
    const results = fuse.search(searchInput);
    const searchResultItems = results.map(result => result.item);
    return (searchResultItems.length > 0 ? searchResultItems : sortedSelectedHistoryRecords).slice(
      0,
      (currentPage + 1) * PAGE_SIZE
    );
  }, [currentPage, sortedSelectedHistoryRecords, searchInput, fuseSearchInex]);

  const onSearchInputChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    setSearchInput(e.target.value);
  };

  useEffect(() => {
    setSortedSelectedHistoryRecords(
      selectedHistoryDirectory
        ? historyRecords[selectedHistoryDirectory].sort(
            (recordA, recordB) => (recordB.timestamp || 0) - (recordA.timestamp || 0)
          )
        : []
    );
  }, [historyRecords, selectedHistoryDirectory]);

  const fetchHistoryDirItems = async (historyDirs: string[]) => {
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
    return _historyRecords;
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
        const _historyRecords = await fetchHistoryDirItems(historyDirs);
        setHistoryRecords(_historyRecords);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    init();
  }, [homeDirectoryPath]);

  return (
    <div style={{ position: 'relative' }}>
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
        <Input
          value={searchInput}
          onChange={onSearchInputChange}
          prefix={<SearchOutlined />}
          placeholder="Search for commands..."></Input>
      </div>
      <div style={{ paddingTop: 60 }}>
        <LoadableContainer isLoading={loading} loadComponent={<div>Loading...</div>}>
          {selectedHistoryDirectory ? (
            <React.Fragment>
              <div className="table-header border-bottom" style={{ padding: '0px 20px' }}>
                <Row gutter={20} style={{ width: '100%' }}>
                  <Col span={3}>
                    <p>#</p>
                  </Col>
                  <Col span={19}>
                    <p>Command Name</p>
                  </Col>
                  <Col span={2}>
                    <p>Actions</p>
                  </Col>
                </Row>
              </div>
              {currentHistoryRecords.map(item => (
                <AnimatedComponent.OpacityFadeInDiv delay={200}>
                  <HistoryCommandListItem
                    item={item}
                    onClick={() => handleOpenTerminalAndExecuteCommand(item.name)}
                  />
                </AnimatedComponent.OpacityFadeInDiv>
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
    </div>
  );
};

export default HistoryScriptsTab;
