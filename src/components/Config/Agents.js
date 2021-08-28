/* eslint-disable react/no-array-index-key */
import {
  CustomerServiceOutlined,
  DeleteOutlined,
  DislikeOutlined,
  IdcardTwoTone,
  LikeOutlined,
  MailTwoTone,
  MobileTwoTone,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Input,
  message,
  Row,
  Spin,
  Tag,
  Typography,
  Modal,
  Result,
} from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import useConfig from '../../util/hooks/useConfig';
import useUpdateConfig from '../../util/hooks/useUpdateConfig';
import { getAvatarUrlFromName } from '../../util/stringUtils';
import CustomInputLabel from '../CustomInputLabel/CustomInputLabel';

const { Title, Text } = Typography;
const { Meta } = Card;

const createPromise = (handler) => {
  let resolve;
  let reject;

  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
    if (handler) handler(resolve, reject);
  });

  promise.resolve = resolve;
  promise.reject = reject;
  return promise;
};

function Agents() {
  const queryClient = useQueryClient();
  const [closePromise, setClosePromise] = useState(createPromise());
  const { data: config, isLoading } = useConfig();
  const [agentInfo, setAgentInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const {
    reset: resetUpdateState,
    mutate: updateConfig,
    isLoading: updating,
    isSuccess: isUpdated,
    data: updatedConfig,
  } = useUpdateConfig();

  const validateInputs = () => {
    const { name, email } = agentInfo;

    if (!name.trim().length) {
      message.error('Please provide a valid Name!');
      return false;
    }
    if (!email.trim().length) {
      message.error('Please provide a valid Email!');
      return false;
    }

    return true;
  };

  const onClickAddAgent = () => {
    if (validateInputs()) {
      const updatedAgents = cloneDeep(config.agents);
      updatedAgents.unshift(agentInfo);
      updateConfig({ ...config, agents: updatedAgents });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onClickAddAgent();
    }
  };

  const handleDeleteAgent = (agent) => {
    Modal.confirm({
      title: 'Delete User',
      content: (
        <Spin spinning={updating}>
          <h2>
            Are you sure, you want to delete Agent&nbsp;
            <Tag color="red">{agent.name}</Tag> ?
          </h2>
        </Spin>
      ),
      okText: 'Yes',
      cancelText: 'No',
      cancelButtonProps: { icon: <DislikeOutlined /> },
      okButtonProps: { type: 'danger', icon: <LikeOutlined /> },
      onOk: () => {
        let updatedAgents = cloneDeep(config.agents);
        updatedAgents = updatedAgents.filter((item) => item._id !== agent._id);
        updateConfig({ ...config, agents: updatedAgents });
        return closePromise;
      },
    });
  };

  useEffect(() => {
    if (isUpdated) {
      resetUpdateState();
      message.success('Agent List updated successfully');
      setAgentInfo({ name: '', email: '', phone: '' });
      setClosePromise(createPromise());
      closePromise.resolve();
      queryClient.setQueryData(['config'], updatedConfig);
    }
  }, [isUpdated]);

  return (
    <Spin spinning={isLoading}>
      <Title level={2}>Agents</Title>
      <Row justify="center">
        <Col xs={24}>
          <Card>
            <Spin spinning={updating}>
              <Row gutter={10}>
                <Col xs={24} md={8}>
                  <Input
                    allowClear
                    value={agentInfo.name}
                    onChange={(e) =>
                      setAgentInfo({ ...agentInfo, name: e.target.value })
                    }
                    prefix={
                      <CustomInputLabel
                        text="Name"
                        icon={<IdcardTwoTone />}
                        required
                      />
                    }
                    placeholder="Agent's Name"
                    size="large"
                    onKeyDown={handleKeyDown}
                  />
                </Col>
                <Col xs={24} md={6}>
                  <Input
                    allowClear
                    value={agentInfo.email}
                    onChange={(e) =>
                      setAgentInfo({ ...agentInfo, email: e.target.value })
                    }
                    prefix={
                      <CustomInputLabel
                        text="Email"
                        icon={<MailTwoTone />}
                        required
                      />
                    }
                    placeholder="Agent's Email"
                    size="large"
                    onKeyDown={handleKeyDown}
                  />
                </Col>
                <Col xs={24} md={6}>
                  <Input
                    allowClear
                    value={agentInfo.phone}
                    onChange={(e) =>
                      setAgentInfo({ ...agentInfo, phone: e.target.value })
                    }
                    prefix={
                      <CustomInputLabel
                        text="Mobile"
                        icon={<MobileTwoTone />}
                        required
                      />
                    }
                    placeholder="Agent's Phone"
                    size="large"
                    onKeyDown={handleKeyDown}
                  />
                </Col>
                <Col xs={24} md={4}>
                  <Button type="primary" size="large" onClick={onClickAddAgent}>
                    <CustomerServiceOutlined /> Add Agent
                  </Button>
                </Col>
              </Row>
            </Spin>
          </Card>
        </Col>
      </Row>
      <Row justify="center">
        {config && !config.agents.length ? (
          <Result
            status="404"
            title="No Agents defined yet!"
            subTitle="Please add some agents using form provided above."
          />
        ) : null}
      </Row>
      <Row
        justify="center"
        gutter={10}
        style={{ height: '72vh', overflowY: 'auto' }}
      >
        {config
          ? config.agents.map((agent, index) => {
              return (
                <Col xs={12} md={8} key={index + agent.email}>
                  <Card
                    style={{
                      width: '100%',
                      marginTop: 16,
                      backgroundColor: '#CFE5F7',
                    }}
                  >
                    <Meta
                      avatar={
                        <Avatar
                          size={64}
                          src={getAvatarUrlFromName(agent.name)}
                        />
                      }
                      title={
                        <Row gutter={10}>
                          <Col xs={16}>
                            <Title level={4} type="secondary">
                              {agent.name}
                            </Title>
                          </Col>
                          <Col xs={8}>
                            <Button
                              type="danger"
                              onClick={() => {
                                handleDeleteAgent(agent);
                              }}
                            >
                              <DeleteOutlined />
                            </Button>
                          </Col>
                        </Row>
                      }
                      description={
                        <>
                          <Text type="secondary">
                            <MailTwoTone /> {agent.email}
                          </Text>
                          <br />
                          <Text type="secondary">
                            <MobileTwoTone />
                            {agent.phone}
                          </Text>
                        </>
                      }
                    />
                  </Card>
                </Col>
              );
            })
          : null}
      </Row>
    </Spin>
  );
}

export default Agents;
