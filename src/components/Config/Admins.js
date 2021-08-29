/* eslint-disable react/no-array-index-key */
import {
  DeleteOutlined,
  DislikeOutlined,
  IdcardTwoTone,
  LikeOutlined,
  LoadingOutlined,
  MailTwoTone,
  MobileTwoTone,
  SketchOutlined,
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
import createPromise from '../../util/createPromise';
import useConfig from '../../util/hooks/useConfig';
import useUpdateConfig from '../../util/hooks/useUpdateConfig';
import { getAvatarUrlFromName } from '../../util/stringUtils';
import AdminOnly from '../Auth/AdminOnly';
import CustomInputLabel from '../CustomInputLabel/CustomInputLabel';

const { Title, Text } = Typography;
const { Meta } = Card;

function Admins() {
  const queryClient = useQueryClient();
  const [closePromise, setClosePromise] = useState(createPromise());
  const { data: config, isLoading, isFetching } = useConfig();
  const [adminInfo, setAdminInfo] = useState({
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
    const { name, email } = adminInfo;

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

  const onClickAddAdmin = () => {
    if (validateInputs()) {
      const updatedAdmins = cloneDeep(config.admins);
      updatedAdmins.unshift(adminInfo);
      updateConfig({ ...config, admins: updatedAdmins });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onClickAddAdmin();
    }
  };

  const handleDeleteAdmin = (admin) => {
    Modal.confirm({
      title: 'Delete User',
      content: (
        <Spin spinning={updating}>
          <h2>
            Are you sure, you want to delete Admin&nbsp;
            <Tag color="red">{admin.name}</Tag> ?
          </h2>
        </Spin>
      ),
      okText: 'Yes',
      cancelText: 'No',
      cancelButtonProps: { icon: <DislikeOutlined /> },
      okButtonProps: { type: 'danger', icon: <LikeOutlined /> },
      onOk: () => {
        let updatedAdmins = cloneDeep(config.admins);
        updatedAdmins = updatedAdmins.filter((item) => item._id !== admin._id);
        updateConfig({ ...config, admins: updatedAdmins });
        return closePromise;
      },
    });
  };

  useEffect(() => {
    if (isUpdated) {
      resetUpdateState();
      message.success('Admin List updated successfully');
      setAdminInfo({ name: '', email: '', phone: '' });
      setClosePromise(createPromise());
      closePromise.resolve();
      queryClient.setQueryData(['config'], updatedConfig);
    }
  }, [isUpdated]);

  return (
    <Spin spinning={isLoading}>
      <Title level={2}>
        Admins &nbsp;
        <Spin spinning={isFetching} indicator={<LoadingOutlined />} />
      </Title>
      <AdminOnly>
        <Row justify="center">
          <Col xs={24}>
            <Card>
              <Spin spinning={updating}>
                <Row gutter={10}>
                  <Col xs={24} md={8}>
                    <Input
                      allowClear
                      value={adminInfo.name}
                      onChange={(e) =>
                        setAdminInfo({ ...adminInfo, name: e.target.value })
                      }
                      prefix={
                        <CustomInputLabel
                          text="Name"
                          icon={<IdcardTwoTone />}
                          required
                        />
                      }
                      placeholder="Admin's Name"
                      size="large"
                      onKeyDown={handleKeyDown}
                    />
                  </Col>
                  <Col xs={24} md={6}>
                    <Input
                      allowClear
                      value={adminInfo.email}
                      onChange={(e) =>
                        setAdminInfo({ ...adminInfo, email: e.target.value })
                      }
                      prefix={
                        <CustomInputLabel
                          text="Email"
                          icon={<MailTwoTone />}
                          required
                        />
                      }
                      placeholder="Admin's Email"
                      size="large"
                      onKeyDown={handleKeyDown}
                    />
                  </Col>
                  <Col xs={24} md={6}>
                    <Input
                      allowClear
                      value={adminInfo.phone}
                      onChange={(e) =>
                        setAdminInfo({ ...adminInfo, phone: e.target.value })
                      }
                      prefix={
                        <CustomInputLabel
                          text="Mobile"
                          icon={<MobileTwoTone />}
                          required
                        />
                      }
                      placeholder="Admin's Phone"
                      size="large"
                      onKeyDown={handleKeyDown}
                    />
                  </Col>
                  <Col xs={24} md={4}>
                    <Button
                      type="primary"
                      size="large"
                      onClick={onClickAddAdmin}
                    >
                      <SketchOutlined /> Add Admin
                    </Button>
                  </Col>
                </Row>
              </Spin>
            </Card>
          </Col>
        </Row>
      </AdminOnly>
      <Row justify="center">
        {config && !config.admins.length ? (
          <Result
            status="404"
            title="No Admins defined yet!"
            subTitle="Please add some admins using form provided above."
          />
        ) : null}
      </Row>
      <Row
        justify="center"
        gutter={10}
        style={{ height: '72vh', overflowY: 'auto' }}
      >
        {config
          ? config.admins.map((admin, index) => {
              return (
                <Col xs={12} md={8} key={index + admin.email}>
                  <Card
                    style={{
                      width: '100%',
                      marginTop: 16,
                      backgroundColor: '#D3D3D3',
                      color: 'white',
                    }}
                  >
                    <Meta
                      avatar={
                        <Avatar
                          size={64}
                          src={getAvatarUrlFromName(admin.name)}
                        />
                      }
                      title={
                        <Row gutter={10}>
                          <Col xs={16}>
                            <Title level={4}>{admin.name}</Title>
                          </Col>
                          <AdminOnly>
                            <Col xs={8}>
                              <Button
                                type="danger"
                                onClick={() => {
                                  handleDeleteAdmin(admin);
                                }}
                              >
                                <DeleteOutlined />
                              </Button>
                            </Col>
                          </AdminOnly>
                        </Row>
                      }
                      description={
                        <>
                          <Text type="secondary">
                            <MailTwoTone /> {admin.email}
                          </Text>
                          <br />
                          <Text type="secondary">
                            <MobileTwoTone />
                            {admin.phone}
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

export default Admins;
