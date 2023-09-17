import { Avatar, Space } from 'antd';

import { STRIPE_BOX_SHADOW } from '../constants';
import { MIDDLE_STYLE } from '../constants/style';
import { ScriptItem } from '../models';

type Props = {
  isSelected?: boolean;
  onClick?: any;
  script: ScriptItem;
};

const ScriptItemListItem = ({ script, isSelected, onClick }: Props) => {
  return (
    <div
      onClick={onClick}
      className={`script-item ${isSelected ? 'script-item-selected' : ''}`}
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
            {script.command}
          </div>
        </div>
      </Space>
    </div>
  );
};

export default ScriptItemListItem;
