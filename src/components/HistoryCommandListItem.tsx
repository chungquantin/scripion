import { BsPlayFill } from 'react-icons/bs';

import { Col, Row, Space, Tooltip } from 'antd';
import moment from 'moment';

import { STRIPE_BOX_SHADOW } from '../constants';
import { MIDDLE_STYLE } from '../constants/style';
import { useBackendInvoker } from '../hooks';
import { HistoryCommandItem } from '../models';
import { shortenString } from '../utils';

type Props = {
  item: HistoryCommandItem;
  isSelected?: boolean;
  onClick?: any;
};

const HistoryCommandListItem = ({ item, isSelected, onClick }: Props) => {
  const { handleExecuteCommand } = useBackendInvoker();
  return (
    <div
      onClick={onClick}
      className={`script-item history-command-list-item ${
        isSelected ? 'script-item-selected' : ''
      }`}
      style={{
        ...MIDDLE_STYLE,
        justifyContent: 'space-between',
        cursor: 'pointer',
        margin: '5px 0px',
      }}>
      <Row gutter={20} style={{ width: '100%' }}>
        <Col className="history-command-list-item-index" span={2}>
          #{item.index}
        </Col>
        <Col span={item.timestamp ? 10 : 14}>
          <div style={{ fontSize: 12, marginBottom: 5 }}>{item.name}</div>
        </Col>
        {item.timestamp && (
          <Col span={4} className="history-command-list-item-date">
            {moment(item.timestamp * 1000).format('DD-MM-YYYY')}
          </Col>
        )}
        <Col span={5}>
          <Space>
            <div
              style={{
                boxShadow: STRIPE_BOX_SHADOW,
                marginRight: 5,
                fontSize: 11,
                marginBottom: 5,
              }}
              className="command-item">
              {shortenString(item.name.split(' ')[0], 25)}
            </div>
          </Space>
        </Col>
        <Col span={1}>
          <Tooltip title="Run command">
            <BsPlayFill onClick={() => handleExecuteCommand(item.name)} />
          </Tooltip>
        </Col>
      </Row>
    </div>
  );
};

export default HistoryCommandListItem;
