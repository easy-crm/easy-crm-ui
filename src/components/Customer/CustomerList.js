import React from 'react';
import { DeleteOutlined, FormOutlined, PhoneTwoTone } from '@ant-design/icons';
import { Typography, Card, Avatar, Col, Tag, Row, Button } from 'antd';
import { DateTime } from 'luxon';
import { getAvatarUrlFromName } from '../../util/stringUtils';
import { DISPLAY_DATE_FORMAT } from '../../util/constants';

const { Text } = Typography;

function CustomerList({ customers }) {
  return (
    <>
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
          <Col xs={24} key={_id}>
            <Card>
              <Row gutter={10}>
                <Col xs={6} md={2}>
                  <Avatar size={64} src={getAvatarUrlFromName(customer.name)} />
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
                          <a href={`tel:${alternatePhone}`}>{alternatePhone}</a>
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
                <Col xs={24} md={6} style={{ paddingTop: '10px' }}>
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
                <Col xs={24} md={4} style={{ paddingTop: '10px' }}>
                  <Button>
                    <FormOutlined />
                  </Button>
                  <Button type="danger">
                    <DeleteOutlined />
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        );
      })}
    </>
  );
}

export default CustomerList;
