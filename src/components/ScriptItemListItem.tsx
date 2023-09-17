import { BsPlayFill } from 'react-icons/bs';

import { Space, Tooltip } from 'antd';

import { STRIPE_BOX_SHADOW } from '../constants';
import { MIDDLE_STYLE } from '../constants/style';
import { ScriptItem } from '../models';

type Props = {
  onClick?: any;
  script: ScriptItem;
};

const ScriptItemListItem = ({ script, onClick }: Props) => {
  return (
    <div
      className={`script-item`}
      style={{
        ...MIDDLE_STYLE,
        justifyContent: 'space-between',
        cursor: 'pointer',
        width: '100%',
        position: 'relative',
      }}>
      <Space style={{ display: 'flex', width: '100%' }}>
        {/* <Avatar src={script.icon} size={25} /> */}
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
      <Tooltip title={'Execute command'}>
        <BsPlayFill onClick={onClick} />
      </Tooltip>
    </div>
  );
};

export default ScriptItemListItem;
