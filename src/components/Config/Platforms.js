import {
  AppstoreAddOutlined,
  CloseCircleOutlined,
  DislikeOutlined,
  IdcardTwoTone,
  LikeOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import {
  Modal,
  message,
  Result,
  Row,
  Spin,
  Tag,
  Typography,
  Col,
  Card,
  Input,
  Button,
  Tooltip,
} from 'antd';
import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import createPromise from '../../util/createPromise';
import useConfig from '../../util/hooks/useConfig';
import useUpdateConfig from '../../util/hooks/useUpdateConfig';
import { stringToColour } from '../../util/stringUtils';
import AdminOnly from '../Auth/AdminOnly';
import CustomInputLabel from '../CustomInputLabel/CustomInputLabel';
import ColorSuggestions from './ColorSuggestions';

const { Title } = Typography;

function Platforms() {
  const { data: config, isLoading, isFetching } = useConfig();
  const queryClient = useQueryClient();
  const [platformObj, setPlatformObj] = useState({
    name: '',
    color: '',
  });
  const [closePromise, setClosePromise] = useState(createPromise());
  const {
    reset: resetUpdateState,
    mutate: updateConfig,
    isLoading: updating,
    isSuccess: isUpdated,
    data: updatedConfig,
  } = useUpdateConfig();

  const handleDelete = (platform) => {
    Modal.confirm({
      title: 'Delete Platform',
      content: (
        <Spin spinning={updating}>
          <h2>
            Are you sure, you want to delete Platform&nbsp;
            <Tag color={platform.color}>{platform.name}</Tag> ?
          </h2>
        </Spin>
      ),
      okText: 'Yes',
      cancelText: 'No',
      cancelButtonProps: { icon: <DislikeOutlined /> },
      okButtonProps: { type: 'danger', icon: <LikeOutlined /> },
      onOk: () => {
        let updatedPlatforms = cloneDeep(config.platforms);
        updatedPlatforms = updatedPlatforms.filter(
          (item) => item._id !== platform._id
        );
        updateConfig({ ...config, platforms: updatedPlatforms });
        return closePromise;
      },
    });
  };

  const validateInputs = () => {
    const { name, color } = platformObj;

    if (!name.trim().length) {
      message.error('Please provide a valid Text!');
      return false;
    }
    if (!color.trim().length) {
      message.error('Please provide a valid Color!');
      return false;
    }

    return true;
  };

  const onClickAddPlatform = () => {
    if (validateInputs()) {
      const updatedPlatforms = cloneDeep(config.platforms);
      updatedPlatforms.unshift(platformObj);
      updateConfig({ ...config, platforms: updatedPlatforms });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onClickAddPlatform();
    }
  };

  useEffect(() => {
    if (isUpdated) {
      resetUpdateState();
      message.success('Platform List updated successfully');
      setPlatformObj({ name: '', color: '' });
      setClosePromise(createPromise());
      closePromise.resolve();
      queryClient.setQueryData(['config'], updatedConfig);
    }
  }, [isUpdated]);

  return (
    <Spin spinning={isLoading}>
      <Title level={2}>
        Platforms &nbsp;
        <Spin spinning={isFetching} indicator={<LoadingOutlined />} />
      </Title>
      <AdminOnly>
        <Row justify="center">
          <Col xs={24}>
            <Card>
              <Spin spinning={updating}>
                <Row gutter={10} justify="center">
                  <Col xs={24} md={8}>
                    <Input
                      allowClear
                      value={platformObj.name}
                      onChange={(e) =>
                        setPlatformObj({
                          ...platformObj,
                          name: e.target.value,
                          color: `#${stringToColour(e.target.value)}`,
                        })
                      }
                      prefix={
                        <CustomInputLabel
                          text="Text"
                          icon={<IdcardTwoTone />}
                          required
                        />
                      }
                      suffix={
                        <Tooltip title="Selected Label Color">
                          <Tag color={platformObj.color}>
                            {platformObj.color}
                          </Tag>
                        </Tooltip>
                      }
                      placeholder="Platform's Name"
                      size="large"
                      onKeyDown={handleKeyDown}
                    />
                  </Col>
                  <Col xs={24} md={4}>
                    <Button
                      type="primary"
                      size="large"
                      onClick={onClickAddPlatform}
                    >
                      <AppstoreAddOutlined /> Add Platform
                    </Button>
                  </Col>
                </Row>
                <Row justify="center">
                  <ColorSuggestions
                    onClick={(color) =>
                      setPlatformObj({ ...platformObj, color })
                    }
                  />
                </Row>
              </Spin>
            </Card>
          </Col>
        </Row>
      </AdminOnly>
      {config &&
        config.platforms.map((platform) => {
          return (
            <Tag
              key={platform._id}
              color={platform.color}
              closable
              onClose={(e) => {
                e.preventDefault();
                handleDelete(platform);
              }}
              style={{ fontSize: '25px', padding: '15px', margin: '10px' }}
              closeIcon={
                <AdminOnly>
                  <CloseCircleOutlined
                    style={{ fontSize: '25px', color: 'black', margin: '5px' }}
                  />
                </AdminOnly>
              }
            >
              {platform.name}
            </Tag>
          );
        })}
      <Row justify="center">
        {config && !config.platforms.length ? (
          <Result
            status="404"
            title="No Platforms defined yet!"
            subTitle="Please add some platforms using form provided above."
          />
        ) : null}
      </Row>
    </Spin>
  );
}

export default Platforms;
