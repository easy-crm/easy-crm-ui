import React from 'react';
import { DeleteOutlined, PhoneTwoTone } from '@ant-design/icons';
import { Typography, Card, Avatar, Col, Tag, Row, Button, Space } from 'antd';
import { DateTime } from 'luxon';
import { getAvatarUrlFromName } from '../../util/stringUtils';
import { DISPLAY_DATE_FORMAT } from '../../util/constants';
import AddUpdateCustomer from './AddUpdateCustomer';

const { Text } = Typography;

function CustomerList({ customers, onChange = () => {} }) {
  return (
    <div style={{ height: '69vh', overflowY: 'auto', overflowX: 'hidden' }}>
      {customers.map((customer) => {
        const {
          _id,
          name,
          email,
          notes = [],
          phone,
          alternatePhone,
          labels,
          platformInfo = [],
        } = customer;
        const [latestNote] = notes;
        return (
          <Row key={_id} gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col xs={24}>
              <Card>
                <Row gutter={10}>
                  <Col xs={6} md={2}>
                    <Avatar
                      size={64}
                      src={getAvatarUrlFromName(customer.name)}
                    />
                  </Col>
                  <Col xs={18} md={6} style={{ paddingTop: '10px' }}>
                    <h3>{name}</h3>
                    <h4 className="unselectable">
                      <PhoneTwoTone style={{ fontSize: '20px' }} />
                      &nbsp;
                      <Text type="secondary">
                        <a href={`tel:${phone}`}>{phone}</a>
                        {alternatePhone ? (
                          <span>
                            |{' '}
                            <a href={`tel:${alternatePhone}`}>
                              {alternatePhone}
                            </a>
                          </span>
                        ) : null}
                      </Text>
                    </h4>

                    {email ? <h4 className="unselectable">{email}</h4> : null}
                    {platformInfo.map((info) => (
                      <Tag key={info.platform.name} color={info.platform.color}>
                        <span className="unselectable">
                          <strong>{info.platform.name}</strong> |{' '}
                          {info.clientCode}
                        </span>
                      </Tag>
                    ))}
                  </Col>
                  <Col xs={24} md={7} style={{ paddingTop: '10px' }}>
                    {labels.map((label) => (
                      <Tag key={label.text} color={label.color}>
                        <strong>{label.text}</strong>
                      </Tag>
                    ))}
                  </Col>
                  <Col xs={24} md={6} style={{ paddingTop: '10px' }}>
                    {latestNote ? (
                      <em>
                        <strong>
                          {DateTime.fromISO(latestNote.addedAt, {
                            zone: 'utc',
                          }).toFormat(DISPLAY_DATE_FORMAT)}
                        </strong>
                        : {latestNote.text}
                      </em>
                    ) : null}
                  </Col>
                  <Col xs={24} md={3} style={{ paddingTop: '10px' }}>
                    <Space>
                      <AddUpdateCustomer
                        type="UPDATE"
                        customer={customer}
                        onChange={onChange}
                      />
                      <Button type="danger">
                        <DeleteOutlined />
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        );
      })}
    </div>
  );
}

export default CustomerList;
