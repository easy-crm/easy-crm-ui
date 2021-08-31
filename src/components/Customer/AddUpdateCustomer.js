/* eslint-disable react/no-array-index-key */
import {
  AppstoreTwoTone,
  CreditCardTwoTone,
  DeleteOutlined,
  FormOutlined,
  IdcardTwoTone,
  InboxOutlined,
  MailTwoTone,
  MobileTwoTone,
  PhoneTwoTone,
  TagTwoTone,
  UserAddOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Divider,
  Input,
  message,
  Modal,
  Row,
  Space,
  Spin,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { cloneDeep } from 'lodash';
import { DateTime } from 'luxon';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { DISPLAY_DATE_FORMAT } from '../../util/constants';
import useConfig from '../../util/hooks/useConfig';
import useCreateCustomer from '../../util/hooks/useCreateCustomer';
import useUpdateCustomer from '../../util/hooks/useUpdateCustomer';
import CustomInputLabel from '../CustomInputLabel/CustomInputLabel';
import LabelSelector from '../Config/LabelSelector';
import PlatformSelector from '../Config/PlatformSelector';
import AdminOnly from '../Auth/AdminOnly';
import AgentOnly from '../Auth/AgentOnly';
import { getAvatarUrlFromName } from '../../util/stringUtils';

const { TabPane } = Tabs;
const { Search } = Input;
const { Text } = Typography;

const defaultCustomerState = {
  _id: null,
  name: '',
  email: '',
  phone: '',
  alternatePhone: '',
  notes: [], // its array as per API but here we will use a single note
  labels: [],
  platformInfo: [],
  nextFollowUpDate: null,
};

const clientTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

function AddUpdateCustomer({
  type = 'ADD',
  customer = cloneDeep(defaultCustomerState),
  onChange = () => {},
}) {
  const { data: config } = useConfig();
  const [showModal, setShowModal] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(customer);
  const [newNote, setNewNote] = useState('');

  const {
    reset: resetCreateState,
    mutate: postCustomerData,
    isLoading: creating,
    isSuccess: isCreated,
  } = useCreateCustomer();

  const {
    reset: resetUpdateState,
    mutate: patchCustomerData,
    isLoading: updating,
    isSuccess: isUpdated,
  } = useUpdateCustomer();

  const newNotes = customerInfo.notes.filter((note) => !note._id);
  const existingNotes = customerInfo.notes.filter((note) => note._id);

  const handleLabelChange = (values) => {
    if (values && values.length) {
      const availableLabels = config.labels;
      const labelsWithInfo = [];
      values.forEach((value) => {
        const labelInfo = availableLabels.find((label) => label.text === value);
        if (labelInfo) {
          labelsWithInfo.push(labelInfo);
        }
      });
      setCustomerInfo({ ...customerInfo, labels: labelsWithInfo });
    } else {
      setCustomerInfo({ ...customerInfo, labels: [] });
    }
  };

  const handlePlatformChange = (values) => {
    if (values && values.length) {
      const availablePlatforms = config.platforms;
      const platformInfo = [];
      values.forEach((value) => {
        const matched = availablePlatforms.find(
          (platform) => platform.name === value
        );
        if (matched) {
          const existingPlatformInfo = customerInfo.platformInfo;
          const sameExists = existingPlatformInfo.find(
            ({ platform: { name } }) => name === matched.name
          );
          let clientCode = '';
          if (sameExists) {
            clientCode = sameExists.clientCode;
          }
          platformInfo.push({ clientCode, platform: matched });
        }
      });
      setCustomerInfo({ ...customerInfo, platformInfo });
    } else {
      setCustomerInfo({ ...customerInfo, platformInfo: [] });
    }
  };

  const handleClientCodeChange = (platformName, value) => {
    const { platformInfo } = customerInfo;
    const update = [];
    platformInfo.forEach((item) => {
      if (item.platform.name === platformName) {
        update.push({ ...item, clientCode: value });
      } else {
        update.push({ ...item });
      }
    });
    setCustomerInfo({ ...customerInfo, platformInfo: update });
  };

  const validateInputs = () => {
    const { name, phone, platformInfo } = customerInfo;

    if (!name.trim().length) {
      message.error('Please provide a valid Name!');
      return false;
    }
    if (!phone.trim().length) {
      message.error('Please provide a valid Phone!');
      return false;
    }

    const invalidClientCode = platformInfo.some(
      (info) => !info.clientCode.trim().length
    );
    if (invalidClientCode) {
      message.error(
        `Please provide a Client ID/Code for all selected Platforms !`
      );
      return false;
    }

    return true;
  };

  const handleAddNewNote = (value) => {
    if (newNote && newNote.length) {
      const updatedNotes = cloneDeep(customerInfo.notes);
      updatedNotes.unshift({
        text: value,
        addedAt: DateTime.now().setZone('utc').toISO(),
      });
      setCustomerInfo({ ...customerInfo, notes: updatedNotes });
      setNewNote('');
    }
  };

  const createUpdateCustomer = () => {
    const isValid = validateInputs();
    const data = cloneDeep(customerInfo);
    if (isValid) {
      if (type === 'ADD') {
        postCustomerData(data);
      }
      if (type === 'UPDATE') {
        patchCustomerData(data);
      }
    }
  };

  const handleDeleteNote = ({ text, addedAt }) => {
    const updatedAddedNotes = cloneDeep(newNotes).filter(
      (note) => !(note.text === text && note.addedAt === addedAt)
    );
    setCustomerInfo({
      ...customerInfo,
      notes: [...updatedAddedNotes, ...existingNotes],
    });
  };

  useEffect(() => {
    if (isCreated) {
      onChange();
      setShowModal(false);
      resetCreateState();
      message.success('Customer added successfully');
      setCustomerInfo(cloneDeep(defaultCustomerState));
    }
  }, [isCreated]);

  useEffect(() => {
    if (isUpdated) {
      onChange();
      setShowModal(false);
      resetUpdateState();
      message.success('Customer updated successfully');
      setCustomerInfo(customer);
    }
  }, [isUpdated]);

  const DetailsForm = (
    <>
      <Input
        size="large"
        allowClear
        placeholder="Enter Full Name"
        prefix={
          <CustomInputLabel text="Name" icon={<IdcardTwoTone />} required />
        }
        value={customerInfo.name}
        onChange={(e) =>
          setCustomerInfo({ ...customerInfo, name: e.target.value })
        }
      />
      <br />
      <br />
      <Input
        size="large"
        allowClear
        placeholder="Enter Primary mobile Number"
        prefix={
          <CustomInputLabel text="Mobile" icon={<MobileTwoTone />} required />
        }
        value={customerInfo.phone}
        onChange={(e) =>
          setCustomerInfo({ ...customerInfo, phone: e.target.value })
        }
      />
      <br />
      <br />
      <Input
        size="large"
        allowClear
        placeholder="Alternate mobile Number"
        prefix={<CustomInputLabel text="Alt Contact" icon={<PhoneTwoTone />} />}
        value={customerInfo.alternatePhone}
        onChange={(e) =>
          setCustomerInfo({
            ...customerInfo,
            alternatePhone: e.target.value,
          })
        }
      />
      <br />
      <br />
      <Input
        size="large"
        allowClear
        placeholder="Enter Email Address"
        prefix={<CustomInputLabel text="Email" icon={<MailTwoTone />} />}
        value={customerInfo.email}
        onChange={(e) =>
          setCustomerInfo({ ...customerInfo, email: e.target.value })
        }
      />
      <br />
      <br />
      <PlatformSelector
        width="100%"
        value={customerInfo.platformInfo.map((info) => info.platform.name)}
        onChange={handlePlatformChange}
      />

      {customerInfo.platformInfo.length ? (
        <Divider plain>
          <CustomInputLabel
            text="Specify Platforms & Client IDs"
            icon={<AppstoreTwoTone />}
          />
        </Divider>
      ) : null}
      <Row>
        {customerInfo.platformInfo.map((info) => (
          <Col xs={24} md={12} key={info.platform.name}>
            <Input
              style={{
                height: '40px',
                backgroundColor: info.clientCode ? 'white' : '#fcbfbf',
              }}
              allowClear
              placeholder="Enter Client ID/Code"
              value={info.clientCode}
              onChange={(e) =>
                handleClientCodeChange(info.platform.name, e.target.value)
              }
              prefix={
                <Tag color={info.platform.color} style={{ width: '90%' }}>
                  {info.platform.name}
                </Tag>
              }
            />
          </Col>
        ))}
      </Row>
    </>
  );

  const InteractionsForm = (
    <>
      <Row>
        <Col xs={24} md={18}>
          <div style={{ border: 'solid 1px #d6d4d4' }}>
            <Row>
              <Col
                xs={8}
                md={4}
                style={{ paddingLeft: '10px', paddingTop: '5px' }}
              >
                <CustomInputLabel text="Labels" icon={<TagTwoTone />} />
              </Col>
              <Col xs={16} md={20}>
                <LabelSelector
                  width="100%"
                  value={customerInfo.labels.map((label) => label.text)}
                  onChange={handleLabelChange}
                />
              </Col>
            </Row>
          </div>
        </Col>
        <Col xs={24} md={6}>
          <DatePicker
            disabledDate={(current) =>
              current && current < moment().startOf('day')
            }
            allowClear
            value={
              customerInfo.nextFollowUpDate
                ? moment(customerInfo.nextFollowUpDate, 'YYYY-MM-DD')
                : null
            }
            onChange={(value) =>
              setCustomerInfo({
                ...customerInfo,
                nextFollowUpDate: value ? value.format('YYYY-MM-DD') : null,
              })
            }
            placeholder="Next Follow Up"
            format={(value) =>
              `Next Follow Up: ${value.format('MMM DD, YYYY')}`
            }
          />
        </Col>
      </Row>
      <br />
      <Row>
        <Col xs={24}>
          <div style={{ height: '63vh', overflowY: 'auto' }}>
            <Search
              autoFocus
              prefix={
                <CustomInputLabel
                  text="New Note"
                  icon={<CreditCardTwoTone />}
                />
              }
              size="large"
              allowClear
              placeholder="Enter something here & press enter"
              enterButton="Add New Note"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onSearch={handleAddNewNote}
            />

            {!newNotes.length ? (
              <Row justify="center">
                <h2 style={{ color: 'grey', marginTop: '10px' }}>
                  <InboxOutlined /> &nbsp;No new notes
                </h2>
              </Row>
            ) : (
              <>
                <Divider plain>New Notes</Divider>
                {newNotes.map((note, index) => (
                  <p key={index + note.text}>
                    <Space>
                      <Tooltip title="Delete Note" placement="right">
                        <Button danger onClick={() => handleDeleteNote(note)}>
                          <DeleteOutlined />
                        </Button>
                      </Tooltip>
                      <Tag color="green">
                        {DateTime.fromISO(note.addedAt, {
                          zone: 'utc',
                        }).toFormat(DISPLAY_DATE_FORMAT)}
                      </Tag>
                      <em>{note.text}</em>
                    </Space>
                  </p>
                ))}
              </>
            )}
            {type === 'UPDATE' ? (
              <>
                {!existingNotes.length ? (
                  <Row justify="center">
                    <h2 style={{ color: 'grey', marginTop: '10px' }}>
                      <InboxOutlined /> &nbsp;No Existing Notes
                    </h2>
                  </Row>
                ) : (
                  <>
                    <Divider plain>Existing Notes</Divider>
                    {existingNotes.map((note) => (
                      <p key={note._id}>
                        <Tooltip title={note.addedBy.email}>
                          <Avatar
                            src={getAvatarUrlFromName(note.addedBy.name)}
                          />
                          &nbsp;<Tag>{note.addedBy.name}</Tag>
                        </Tooltip>
                        <Tag color="blue">
                          {DateTime.fromISO(note.addedAt, {
                            zone: 'utc',
                          })
                            .setZone(clientTZ)
                            .toFormat(`${DISPLAY_DATE_FORMAT}| hh:mm:ss a`)}
                        </Tag>
                        <em>{note.text}</em>
                      </p>
                    ))}
                  </>
                )}
              </>
            ) : null}
          </div>
        </Col>
      </Row>
    </>
  );

  return (
    <>
      <Button
        type={type === 'ADD' ? 'primary' : 'secondary'}
        onClick={() => setShowModal(true)}
      >
        {type === 'ADD' ? (
          <>
            <UserAddOutlined />
            Add Customer
          </>
        ) : (
          <>
            <AgentOnly>
              <Tooltip title="Add & View Notes" placement="top">
                <FormOutlined /> Notes
              </Tooltip>
            </AgentOnly>
            <AdminOnly>
              <Tooltip title="Update Customer & Add/View Notes" placement="top">
                <FormOutlined />
              </Tooltip>
            </AdminOnly>
          </>
        )}
      </Button>
      <Modal
        visible={showModal}
        width={1400}
        style={{ top: 0 }}
        title={
          type === 'ADD' ? (
            'Add Customer'
          ) : (
            <Text level={2}>
              Update Customer : <Tag>{customer.name}</Tag>
            </Text>
          )
        }
        onCancel={() => {
          setShowModal(false);
          if (type === 'ADD') {
            setCustomerInfo(cloneDeep(defaultCustomerState));
          }
          if (type === 'UPDATE') {
            setCustomerInfo(customer);
          }
        }}
        onOk={createUpdateCustomer}
        okType={type === 'ADD' ? 'primary' : 'danger'}
        okText={type === 'ADD' ? 'Add Customer' : 'Update Customer'}
      >
        <Spin spinning={creating || updating}>
          <AdminOnly>
            <Tabs defaultActiveKey="details">
              <TabPane tab="Customer Details" key="details">
                <Row
                  justify="center"
                  style={{ height: '65vh', overflowY: 'auto' }}
                >
                  <Col xs="24" md={12}>
                    {DetailsForm}
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Interactions" key="Interactions">
                {InteractionsForm}
              </TabPane>
            </Tabs>
          </AdminOnly>
          <AgentOnly>{InteractionsForm}</AgentOnly>
        </Spin>
      </Modal>
    </>
  );
}

export default AddUpdateCustomer;
