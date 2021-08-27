import {
  LoadingOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import {
  Spin,
  Input,
  Row,
  Pagination,
  Typography,
  Col,
  Button,
  Select,
  Tag,
  Tooltip,
  DatePicker,
} from 'antd';
import React, { useState } from 'react';
import moment from 'moment';
import useCustomers from '../../util/hooks/useCustomers';
import useConfig from '../../util/hooks/useConfig';

import CustomerList from './CustomerList';

const dateDisplay = 'MMM DD, YYYY';

const { Title } = Typography;

const { Search } = Input;
const { Option } = Select;

function Customer() {
  const [queryData, setQueryData] = useState({
    sort: 'name|ascend',
    clientTZ: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [appliedFilters, setAppliedFilters] = useState({});
  const {
    data: customerData,
    isLoading: loadingCustomers,
    isFetching: fetchingCustomers,
  } = useCustomers(queryData);
  const { data: config } = useConfig();

  const handlePaginationChange = (page, pageSize) => {
    setQueryData({
      ...queryData,
      limit: pageSize,
      offset: page === 0 ? 0 : (page - 1) * pageSize,
    });
  };

  const handleSearch = (searchKeyword) => {
    setQueryData({
      ...queryData,
      searchKeyword,
    });
  };

  const toggleSort = () => {
    const { sort } = queryData;
    const [field, order] = sort.split('|');
    if (order === 'ascend') {
      setQueryData({ ...queryData, sort: `${field}|descend` });
    } else {
      setQueryData({ ...queryData, sort: `${field}|ascend` });
    }
  };

  const applyFilter = (field, value) => {
    const updated = { ...appliedFilters };
    const updatedQueryData = { ...queryData };
    if (value) {
      updated[field] = value;
      updatedQueryData[field] = value;
    } else {
      delete updated[field];
      delete updatedQueryData[field];
    }
    setAppliedFilters(updated);
    setQueryData(updatedQueryData);
  };

  return (
    <Spin spinning={loadingCustomers}>
      <div className="view-container">
        <Row>
          <Col xs={24} md={6}>
            <Title>
              Customers&nbsp;
              <Spin
                spinning={fetchingCustomers}
                indicator={<LoadingOutlined />}
              />
            </Title>
          </Col>
          <Col
            xs={24}
            md={14}
            style={{ paddingTop: '10px', textAlign: 'right' }}
          >
            <Search
              placeholder="Search name, phone, client code, notes etc."
              allowClear
              enterButton="Search"
              size="medium"
              onSearch={handleSearch}
            />
          </Col>
          <Col
            xs={24}
            md={4}
            style={{ paddingTop: '10px', textAlign: 'right' }}
          >
            <Button type="primary">
              <UserAddOutlined />
              Add Customer
            </Button>
          </Col>
        </Row>
        {customerData ? (
          <>
            <Row>
              <Col xs={24}>
                <Tooltip title="Sort By Name" placement="right">
                  <Button onClick={toggleSort}>
                    {queryData.sort.split('|')[1] === 'ascend' ? (
                      <SortAscendingOutlined />
                    ) : (
                      <SortDescendingOutlined />
                    )}
                    Name
                  </Button>
                </Tooltip>
                <Select
                  mode="multiple"
                  placeholder="Platforms"
                  style={{ width: 150 }}
                  allowClear
                  onChange={(value) => {
                    applyFilter('platforms', value ? value.join(',') : null);
                  }}
                  value={
                    appliedFilters.platforms
                      ? appliedFilters.platforms.split(',')
                      : []
                  }
                >
                  {config
                    ? config.platforms.map((platform) => (
                        <Option key={platform.name} value={platform.name}>
                          <Tag color={platform.color}>{platform.name}</Tag>
                        </Option>
                      ))
                    : null}
                </Select>
                <Select
                  placeholder="Platform Count"
                  style={{ width: 150 }}
                  allowClear
                  onChange={(value) => {
                    applyFilter('platformCount', value);
                  }}
                  value={appliedFilters.platformCount}
                >
                  <Option value="SINGLE">Single</Option>
                  <Option value="MULTIPLE">Multiple</Option>
                  <Option value="NONE">None</Option>
                </Select>

                <Select
                  mode="multiple"
                  placeholder="Labels"
                  style={{ width: 150 }}
                  allowClear
                  onChange={(value) => {
                    applyFilter('labels', value ? value.join(',') : null);
                  }}
                  value={
                    appliedFilters.labels
                      ? appliedFilters.labels.split(',')
                      : []
                  }
                >
                  {config
                    ? config.labels.map((label) => (
                        <Option key={label.text} value={label.text}>
                          <Tag color={label.color}>{label.text}</Tag>
                        </Option>
                      ))
                    : null}
                </Select>
                <DatePicker
                  allowClear
                  value={
                    appliedFilters.createdAtStart
                      ? moment(appliedFilters.createdAtStart, 'YYYY-MM-DD')
                      : null
                  }
                  onChange={(value) =>
                    applyFilter(
                      'createdAtStart',
                      value ? value.format('YYYY-MM-DD') : null
                    )
                  }
                  placeholder="Created from"
                  format={(value) => `From: ${value.format(dateDisplay)}`}
                />
                <DatePicker
                  allowClear
                  value={
                    appliedFilters.createdAtEnd
                      ? moment(appliedFilters.createdAtEnd, 'YYYY-MM-DD')
                      : null
                  }
                  onChange={(value) =>
                    applyFilter(
                      'createdAtEnd',
                      value ? value.format('YYYY-MM-DD') : null
                    )
                  }
                  placeholder="Created till"
                  format={(value) => `To: ${value.format(dateDisplay)}`}
                />
                <DatePicker
                  allowClear
                  value={
                    appliedFilters.updatedAtStart
                      ? moment(appliedFilters.updatedAtStart, 'YYYY-MM-DD')
                      : null
                  }
                  onChange={(value) =>
                    applyFilter(
                      'updatedAtStart',
                      value ? value.format('YYYY-MM-DD') : null
                    )
                  }
                  placeholder="Last Updated After"
                  format={(value) =>
                    `Updated After: ${value.format(dateDisplay)}`
                  }
                />
              </Col>
            </Row>
            <Row>
              <Col xs={24} md={24}>
                {customerData.customers.length ? (
                  <Row justify="end">
                    <Pagination
                      size="default"
                      showTotal={(total, range) =>
                        `${range[0]}-${range[1]} of ${total} customers`
                      }
                      showSizeChanger
                      pageSizeOptions={[5, 10, 50, 100]}
                      defaultCurrent={1}
                      defaultPageSize={customerData.limit}
                      total={customerData.totalRecords}
                      onChange={handlePaginationChange}
                    />
                  </Row>
                ) : null}
              </Col>
            </Row>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <CustomerList customers={customerData.customers} />
            </Row>
          </>
        ) : null}
      </div>
    </Spin>
  );
}

export default Customer;
