import { useEffect, useState } from 'react';
import { BsPlayFill } from 'react-icons/bs';
import { FiCopy } from 'react-icons/fi';

import { invoke } from '@tauri-apps/api';
import { Avatar, Layout, Space } from 'antd';

import AnimatedComponent from './components/AnimatedComponent';
import { STRIPE_BOX_SHADOW } from './constants';
import { HOMEBREW_COMMANDS } from './constants/commands/homebrew';
import { MIDDLE_STYLE } from './constants/style';
import './index.scss';

type ScriptItem = {
  name: string;
  args: string;
  command: string;
  icon: string;
};

function App() {
  const [selectedScript, setSelectedScript] = useState<ScriptItem | undefined>(undefined);
  const [scripts, setScripts] = useState<ScriptItem[]>([]);

  const handleExecuteCommand = async (command: string) => {
    const output = await invoke<string>('execute_command', { command });
    console.log(output);
  };

  const handleSelectScriptItem = async (scriptItem: ScriptItem) => {
    setSelectedScript(scriptItem);
  };

  useEffect(() => {
    setScripts(HOMEBREW_COMMANDS);
  }, []);

  useEffect(() => {
    setSelectedScript(scripts.length > 0 ? scripts[0] : undefined);
  }, [scripts]);

  return (
    <div style={{ overflow: 'hidden' }}>
      <div
        className="container"
        style={{ boxShadow: STRIPE_BOX_SHADOW, height: '100vh', width: '100vw' }}>
        <AnimatedComponent.OpacityFadeInDiv delay={300}>
          <Layout>
            <Layout.Sider width={325}>
              <div
                style={{
                  overflow: 'auto',
                  height: '100vh',
                  padding: '20px 10px',
                }}>
                {scripts.map(script => (
                  <div className="border-bottom">
                    <div
                      onClick={() => handleSelectScriptItem(script)}
                      className={`script-item ${
                        `${selectedScript?.command}${selectedScript?.args}` ===
                        `${script.command}${script.args}`
                          ? 'script-item-selected'
                          : ''
                      }`}
                      style={{
                        ...MIDDLE_STYLE,
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        margin: '5px 0px',
                      }}>
                      <Space style={{ display: 'flex' }}>
                        <Avatar src={script.icon} size={25} />
                        <div>
                          <div style={{ fontSize: 12 }}>{script.name}</div>
                          <div
                            style={{
                              boxShadow: STRIPE_BOX_SHADOW,
                              marginRight: 5,
                              fontSize: 11,
                              marginBottom: 5,
                            }}
                            className="command-item">
                            {script.command} {script.args}
                          </div>
                        </div>
                      </Space>
                    </div>
                  </div>
                ))}
              </div>
            </Layout.Sider>
            <Layout.Content>
              <Space>
                <BsPlayFill />
                <FiCopy />
              </Space>
            </Layout.Content>
          </Layout>
        </AnimatedComponent.OpacityFadeInDiv>
      </div>
    </div>
  );
}

export default App;
