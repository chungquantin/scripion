import { BsPlayFill } from 'react-icons/bs';

import { Col, Row, Tooltip } from 'antd';
import moment from 'moment';

import { MIDDLE_STYLE } from '../constants/style';
import { HistoryCommandItem } from '../models';

type Props = {
  item: HistoryCommandItem;
  isSelected?: boolean;
  onClick?: any;
};

const HistoryCommandListItem = ({ item, isSelected, onClick }: Props) => {
  return (
    <div
      className={`script-item history-command-list-item  ${
        isSelected ? 'history-command-list-item-selected' : ''
      }`}
      style={{
        ...MIDDLE_STYLE,
        justifyContent: 'space-between',
        cursor: 'pointer',
      }}>
      <Row gutter={20} style={{ width: '100%' }}>
        <Col className="history-command-list-item-index" span={3}>
          #{item.index}
        </Col>
        <Col span={19}>
          <div style={{ fontSize: 12, marginBottom: 5 }}>{item.name}</div>
          {item.timestamp && (
            <div className="history-command-list-item-date">
              {moment(item.timestamp * 1000).format('DD-MM-YYYY HH:mm:ss')}
            </div>
          )}
        </Col>
        <Col span={2}>
          <Tooltip title="Execute command">
            <BsPlayFill onClick={onClick} />
          </Tooltip>
        </Col>
      </Row>
    </div>
  );
};

export default HistoryCommandListItem;
