/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo } from 'react';
import { GoFileDirectoryFill } from 'react-icons/go';

import { Space } from 'antd';

import { MIDDLE_STYLE } from '../constants/style';
import { useScriptManagerStore } from '../stores';
import { formatHistoryDirectoryName } from '../utils';

const HistoryDirectoriesTab = () => {
  const {
    selectedHistoryDirectory,
    setSelectedHistoryDirectory,
    homeDirectoryPath,
    historyRecords,
  } = useScriptManagerStore();

  const historyNames = useMemo(
    () =>
      Object.keys(historyRecords)
        .map(item => ({
          formatted: formatHistoryDirectoryName(item),
          origin: item,
        }))
        .sort(
          (nameA, nameB) =>
            historyRecords[nameB.origin].length - historyRecords[nameA.origin].length
        ),
    [historyRecords]
  );

  useEffect(() => {
    setSelectedHistoryDirectory(historyNames.length > 0 ? historyNames?.[0].origin : undefined);
  }, [historyNames]);

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {historyNames.map(item => (
        <div
          onClick={() => setSelectedHistoryDirectory(item.origin)}
          className={
            selectedHistoryDirectory === item.origin
              ? 'history-directory-item-selected'
              : 'history-directory-item'
          }>
          <div style={{ ...MIDDLE_STYLE, justifyContent: 'space-between' }}>
            <div>
              <GoFileDirectoryFill style={{ marginRight: 10 }} />
              {item.formatted}
              <div className="history-directory-sub">{`${homeDirectoryPath}/${item.origin}`}</div>
            </div>
            <div
              style={{
                fontWeight: 'normal',
                fontSize: 11,
              }}>
              {historyRecords[item.origin].length}
            </div>
          </div>
        </div>
      ))}
    </Space>
  );
};

export default HistoryDirectoriesTab;
