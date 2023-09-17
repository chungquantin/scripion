/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

import { FolderOpenOutlined } from '@ant-design/icons';
// import { BsPlayFill } from 'react-icons/bs';
// import { FiCopy } from 'react-icons/fi';
import { Col, Layout, Row } from 'antd';

import AnimatedComponent from './components/AnimatedComponent';
import HistoryDirectoriesTab from './components/HistoryDirectoriesTab';
import HistoryScriptsTab from './components/HistoryScriptsTab';
import HistoryTabHeader from './components/HistoryTabHeader';
import SystemScriptsTab from './components/SystemScriptsTab';
import WorkspaceContainer from './components/WorkspaceContainer';
import WorkspaceHeader from './components/WorkspaceHeader';
import WorkspaceListTab from './components/WorkspaceListTab';
import { STRIPE_BOX_SHADOW } from './constants';
import { MIDDLE_STYLE } from './constants/style';
import { useBackendInvoker } from './hooks';
import './index.scss';
import { useScriptManagerStore } from './stores';

enum TabItem {
  Workspace,
  History,
  System,
}

function App() {
  const { homeDirectoryPath, setHomeDirectoryPath, shellDirectoryPath, setShellDirectoryPath } =
    useScriptManagerStore();
  const { handleExecuteCommand, handleGetShellPath, handleOpenFolder } = useBackendInvoker();
  const [selectedTab, setSelectedTab] = useState<TabItem>(TabItem.Workspace);

  useEffect(() => {
    const initHistory = async () => {
      const homeDirectoryPath = await handleExecuteCommand('echo $HOME');
      setHomeDirectoryPath(homeDirectoryPath);
      const shellPath = await handleGetShellPath();
      setShellDirectoryPath(shellPath);
    };
    initHistory();
  }, []);

  return (
    <div style={{ overflow: 'hidden' }}>
      <div
        className="container"
        style={{ boxShadow: STRIPE_BOX_SHADOW, height: '100vh', width: '100vw' }}>
        <AnimatedComponent.OpacityFadeInDiv delay={300}>
          <Layout>
            <Layout.Sider width={280} style={{ height: 'calc(100% - 85px)' }}>
              <Row
                className="tab-container"
                gutter={25}
                style={{
                  ...MIDDLE_STYLE,
                }}>
                {[
                  {
                    key: TabItem.Workspace,
                    name: 'Workspace',
                  },
                  {
                    key: TabItem.History,
                    name: 'History',
                  },
                  {
                    key: TabItem.System,
                    name: 'System',
                  },
                ].map(tab => (
                  <Col
                    onClick={() => setSelectedTab(tab.key)}
                    key={tab.key}
                    style={{ cursor: 'pointer' }}
                    className={tab.key === selectedTab ? 'tab-item-selected' : 'tab-item'}
                    span={8}>
                    {tab.name}
                  </Col>
                ))}
              </Row>
              <div
                style={{
                  overflow: 'auto',
                  height: '100vh',
                  padding: '20px 10px',
                }}>
                {selectedTab === TabItem.Workspace && <WorkspaceListTab />}
                {selectedTab === TabItem.System && <SystemScriptsTab />}
                {selectedTab === TabItem.History && <HistoryDirectoriesTab />}
              </div>
            </Layout.Sider>
            <Layout.Content style={{ position: 'relative' }}>
              <Layout.Header style={{ padding: 0, ...MIDDLE_STYLE }}>
                {selectedTab === TabItem.History && <HistoryTabHeader />}
                {selectedTab === TabItem.Workspace && <WorkspaceHeader />}
              </Layout.Header>
              <div style={{ overflow: 'auto', height: 'calc(100% - 85px)' }}>
                {selectedTab === TabItem.Workspace && <WorkspaceContainer />}
                {selectedTab === TabItem.History && <HistoryScriptsTab />}
              </div>
            </Layout.Content>
            <Row
              className="status-container"
              gutter={25}
              style={{
                ...MIDDLE_STYLE,
              }}>
              <Col
                className="status-item"
                span={12}
                style={{ ...MIDDLE_STYLE, justifyContent: 'space-between' }}>
                <h4>Home Path</h4>
                <p style={{ ...MIDDLE_STYLE }}>
                  {homeDirectoryPath}{' '}
                  <div
                    style={{ cursor: 'pointer', fontSize: 12, marginLeft: 15 }}
                    onClick={() => handleOpenFolder(`${homeDirectoryPath}`)}>
                    <FolderOpenOutlined />
                  </div>
                </p>
              </Col>
              <Col
                className="status-item"
                span={12}
                style={{ ...MIDDLE_STYLE, justifyContent: 'space-between' }}>
                <h4>Shell Path</h4>
                <p style={{ ...MIDDLE_STYLE }}>
                  {shellDirectoryPath}{' '}
                  <div
                    style={{ cursor: 'pointer', fontSize: 12, marginLeft: 15 }}
                    onClick={() => handleOpenFolder(`${shellDirectoryPath}`)}>
                    <FolderOpenOutlined />
                  </div>
                </p>
              </Col>
            </Row>
          </Layout>
        </AnimatedComponent.OpacityFadeInDiv>
      </div>
    </div>
  );
}

export default App;
