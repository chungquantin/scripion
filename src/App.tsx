/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

// import { BsPlayFill } from 'react-icons/bs';
// import { FiCopy } from 'react-icons/fi';
import { Col, Layout, Row } from 'antd';

import AnimatedComponent from './components/AnimatedComponent';
import HistoryDirectoriesTab from './components/HistoryDirectoriesTab';
import HistoryScriptsTab from './components/HistoryScriptsTab';
import HistoryTabHeader from './components/HistoryTabHeader';
import SystemScriptsTab from './components/SystemScriptsTab';
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
  const { handleExecuteCommand, handleGetShellPath } = useBackendInvoker();
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
            <Layout.Sider width={325}>
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
                {selectedTab === TabItem.System && <SystemScriptsTab />}
                {selectedTab === TabItem.History && <HistoryDirectoriesTab />}
              </div>
            </Layout.Sider>
            <Layout.Content>
              <Layout.Header style={{ padding: 0, ...MIDDLE_STYLE }}>
                {selectedTab === TabItem.History && <HistoryTabHeader />}
              </Layout.Header>
              <div style={{ overflow: 'auto', height: 'calc(100% - 90px)' }}>
                {selectedTab === TabItem.History && <HistoryScriptsTab />}
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
                    {homeDirectoryPath}
                  </Col>
                  <Col
                    className="status-item"
                    span={12}
                    style={{ ...MIDDLE_STYLE, justifyContent: 'space-between' }}>
                    <h4>Shell Path</h4>
                    <p>{shellDirectoryPath}</p>
                  </Col>
                </Row>
              </div>
            </Layout.Content>
          </Layout>
        </AnimatedComponent.OpacityFadeInDiv>
      </div>
    </div>
  );
}

export default App;
