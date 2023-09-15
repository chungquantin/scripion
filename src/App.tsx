import { useEffect, useState } from 'react';
import { BsPlayFill } from 'react-icons/bs';
import { FiCopy } from 'react-icons/fi';

import { invoke } from '@tauri-apps/api';
import { Avatar, Space, Tooltip } from 'antd';

import AnimatedComponent from './components/AnimatedComponent';
import { MIDDLE_STYLE } from './constants/style';
import './index.scss';

const MENU_ITEM_STYLE: React.CSSProperties = {
  borderRadius: 10,
};

type ScriptItem = {
  name: string;
  command: string;
  icon: string;
};

function App() {
  const [scripts, setScripts] = useState<ScriptItem[]>([]);

  const handleExecuteCommand = async (command: string) => {
    await invoke('execute_command', { command });
  };

  useEffect(() => {
    setScripts([
      {
        command: 'brew list',
        name: 'List commands of Homebrew',
        icon: 'homebrew.png',
      },
    ]);
  }, []);

  return (
    <div>
      <div className="container" style={{ ...MENU_ITEM_STYLE }}>
        <AnimatedComponent.OpacityFadeInDiv delay={300}>
          <div>
            <h4>Script Manager</h4>
            {scripts.map(script => (
              <Tooltip title={`$ ${script.command}`}>
                <div
                  onClick={() => handleExecuteCommand(script.command)}
                  className="script-item"
                  style={{
                    ...MIDDLE_STYLE,
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    margin: '10px 0px',
                  }}>
                  <Space style={{ display: 'flex' }}>
                    <Avatar src={script.icon} size={25} />
                    <div>
                      <div style={{ fontSize: 13 }}>{script.name}</div>
                    </div>
                  </Space>
                  <Space>
                    <BsPlayFill />
                    <FiCopy />
                  </Space>
                </div>
              </Tooltip>
            ))}
          </div>
        </AnimatedComponent.OpacityFadeInDiv>
      </div>
    </div>
  );
}

export default App;
