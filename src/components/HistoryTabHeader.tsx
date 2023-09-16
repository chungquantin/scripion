import { FolderOpenOutlined } from '@ant-design/icons';

import { MIDDLE_STYLE } from '../constants/style';
import { useBackendInvoker } from '../hooks';
import { useScriptManagerStore } from '../stores';

const HistoryTabHeader = () => {
  const { handleOpenFolder } = useBackendInvoker();
  const { homeDirectoryPath, selectedHistoryDirectory } = useScriptManagerStore();
  return (
    <div
      style={{
        ...MIDDLE_STYLE,
        justifyContent: 'space-between',
        width: '100%',
        padding: '0px 10px',
      }}>
      <div style={{ fontSize: 'smaller' }}>
        <span style={{ fontWeight: 'bold' }}>Path:</span>
        {homeDirectoryPath}/{selectedHistoryDirectory}
      </div>
      <div>
        <div
          style={{ cursor: 'pointer', fontSize: 12 }}
          onClick={() => handleOpenFolder(`${homeDirectoryPath}/${selectedHistoryDirectory}`)}>
          Open File <FolderOpenOutlined />
        </div>
      </div>
    </div>
  );
};

export default HistoryTabHeader;
