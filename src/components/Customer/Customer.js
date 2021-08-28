import {
  LoadingOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
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
  Tooltip,
  DatePicker,
  Result,
} from 'antd';
import React, { useState } from 'react';
import moment from 'moment';
import useCustomers from '../../util/hooks/useCustomers';

import CustomerList from './CustomerList';
import AddUpdateCustomer from './AddUpdateCustomer';
import LabelSelector from './LabelSelector';
import PlatformSelector from './PlatformSelector';

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
    refetch,
  } = useCustomers(queryData);

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

  const handleSort = (fieldToSort) => {
    const { sort } = queryData;
    const [field, order] = sort.split('|');
    if (fieldToSort === field) {
      if (order === 'ascend') {
        setQueryData({ ...queryData, sort: `${field}|descend` });
      } else {
        setQueryData({ ...queryData, sort: `${field}|ascend` });
      }
    } else {
      setQueryData({ ...queryData, sort: `${fieldToSort}|ascend` });
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

  const handleCustomerDataChanges = () => {
    setQueryData({ ...queryData, sort: 'updatedAt|descend' });
    refetch();
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
            <AddUpdateCustomer
              type="ADD"
              onChange={handleCustomerDataChanges}
            />
          </Col>
        </Row>
        {customerData ? (
          <>
            <Row>
              <Col xs={24}>
                <LabelSelector
                  onChange={(value) => {
                    applyFilter('labels', value ? value.join(',') : null);
                  }}
                  value={
                    appliedFilters.labels
                      ? appliedFilters.labels.split(',')
                      : []
                  }
                />
                <PlatformSelector
                  value={
                    appliedFilters.platforms
                      ? appliedFilters.platforms.split(',')
                      : []
                  }
                  onChange={(value) => {
                    applyFilter('platforms', value ? value.join(',') : null);
                  }}
                />
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
                  placeholder="Updated"
                  format={(value) => `Updated: ${value.format(dateDisplay)}`}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={24} md={24}>
                {customerData.customers ? (
                  <Row>
                    <Col xs={24} md={12}>
                      <Tooltip title="Sort By Name" placement="right">
                        <Button onClick={() => handleSort('name')}>
                          {queryData.sort.includes('name') ? (
                            <span>
                              {queryData.sort.split('|')[1] === 'ascend' ? (
                                <SortAscendingOutlined />
                              ) : (
                                <SortDescendingOutlined />
                              )}
                            </span>
                          ) : null}
                          Sort by Name
                        </Button>
                      </Tooltip>
                      <Tooltip title="Sort By Updation" placement="right">
                        <Button onClick={() => handleSort('updatedAt')}>
                          {queryData.sort.includes('updatedAt') ? (
                            <span>
                              {queryData.sort.split('|')[1] === 'ascend' ? (
                                <SortAscendingOutlined />
                              ) : (
                                <SortDescendingOutlined />
                              )}
                            </span>
                          ) : null}
                          Sort By Updation
                        </Button>
                      </Tooltip>
                    </Col>
                    <Col xs={24} md={12} style={{ textAlign: 'right' }}>
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
                    </Col>
                  </Row>
                ) : null}
              </Col>
            </Row>
            {!loadingCustomers && !customerData.customers.length ? (
              <Result
                status="404"
                title="No Data Found"
                subTitle="Your specified criteria doesn't match any record!"
              />
            ) : null}
            <CustomerList
              customers={customerData.customers}
              onChange={handleCustomerDataChanges}
            />
          </>
        ) : null}
      </div>
    </Spin>
  );
}

export default Customer;
