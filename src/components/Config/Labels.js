import {
  CloseCircleOutlined,
  DislikeOutlined,
  // FormatPainterOutlined,
  IdcardTwoTone,
  LikeOutlined,
  LoadingOutlined,
  TagsOutlined,
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

function Labels() {
  const { data: config, isLoading, isFetching } = useConfig();
  const queryClient = useQueryClient();
  const [labelInfo, setLabelInfo] = useState({
    text: '',
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

  const handleDelete = (label) => {
    Modal.confirm({
      title: 'Delete Label',
      content: (
        <Spin spinning={updating}>
          <h2>
            Are you sure, you want to delete Label&nbsp;
            <Tag color={label.color}>{label.text}</Tag> ?
          </h2>
        </Spin>
      ),
      okText: 'Yes',
      cancelText: 'No',
      cancelButtonProps: { icon: <DislikeOutlined /> },
      okButtonProps: { type: 'danger', icon: <LikeOutlined /> },
      onOk: () => {
        let updatedLabels = cloneDeep(config.labels);
        updatedLabels = updatedLabels.filter((item) => item._id !== label._id);
        updateConfig({ ...config, labels: updatedLabels });
        return closePromise;
      },
    });
  };

  const validateInputs = () => {
    const { text, color } = labelInfo;

    if (!text.trim().length) {
      message.error('Please provide a valid Text!');
      return false;
    }
    if (!color.trim().length) {
      message.error('Please provide a valid Color!');
      return false;
    }

    return true;
  };

  const onClickAddLabel = () => {
    if (validateInputs()) {
      const updatedLabels = cloneDeep(config.labels);
      updatedLabels.unshift(labelInfo);
      updateConfig({ ...config, labels: updatedLabels });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onClickAddLabel();
    }
  };

  useEffect(() => {
    if (isUpdated) {
      resetUpdateState();
      message.success('Label List updated successfully');
      setLabelInfo({ text: '', color: '' });
      setClosePromise(createPromise());
      closePromise.resolve();
      queryClient.setQueryData(['config'], updatedConfig);
    }
  }, [isUpdated]);

  return (
    <Spin spinning={isLoading}>
      <Title level={2}>
        Labels &nbsp;
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
                      value={labelInfo.text}
                      onChange={(e) =>
                        setLabelInfo({
                          ...labelInfo,
                          text: e.target.value,
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
                        <Tooltip title="Label Color">
                          <Tag color={labelInfo.color}>{labelInfo.color}</Tag>
                        </Tooltip>
                      }
                      placeholder="Label's Text"
                      size="large"
                      onKeyDown={handleKeyDown}
                    />
                  </Col>
                  <Col xs={24} md={4}>
                    <Button
                      type="primary"
                      size="large"
                      onClick={onClickAddLabel}
                    >
                      <TagsOutlined /> Add Label
                    </Button>
                  </Col>
                </Row>
                <Row justify="center">
                  <ColorSuggestions
                    onClick={(color) => setLabelInfo({ ...labelInfo, color })}
                  />
                </Row>
              </Spin>
            </Card>
          </Col>
        </Row>
      </AdminOnly>
      {config &&
        config.labels.map((label) => {
          return (
            <Tag
              key={label._id}
              color={label.color}
              closable
              onClose={(e) => {
                e.preventDefault();
                handleDelete(label);
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
              {label.text}
            </Tag>
          );
        })}
      <Row justify="center">
        {config && !config.labels.length ? (
          <Result
            status="404"
            title="No Labels defined yet!"
            subTitle="Please add some labels using form provided above."
          />
        ) : null}
      </Row>
    </Spin>
  );
}

export default Labels;
