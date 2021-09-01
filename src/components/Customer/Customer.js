import {
  FilterOutlined,
  FilterTwoTone,
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
  Modal,
  Space,
  Tag,
} from 'antd';
import React, { useState } from 'react';
import moment from 'moment';
import useCustomers from '../../util/hooks/useCustomers';

import CustomerList from './CustomerList';
import AddUpdateCustomer from './AddUpdateCustomer';
import LabelSelector from '../Config/LabelSelector';
import PlatformSelector from '../Config/PlatformSelector';
import usePrefetchCustomers from '../../util/hooks/usePrefetchCustomers';
import AdminOnly from '../Auth/AdminOnly';
import OwnerSelector from '../Config/OwnerSelector';
import ExportCustomersData from './ExportCustomersData';

const dateDisplay = 'MMM DD, YYYY';

const { Title } = Typography;

const { Search } = Input;
const { Option } = Select;

function Customer() {
  const [queryData, setQueryData] = useState({
    limit: 50,
    offset: 0,
    sort: 'name|ascend',
    clientTZ: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [appliedFilters, setAppliedFilters] = useState({});
  const [showFilterModal, setShowFilterModal] = useState(false);

  const {
    data: customerData,
    isLoading: loadingCustomers,
    isFetching: fetchingCustomers,
    refetch,
  } = useCustomers(queryData);

  usePrefetchCustomers({
    ...queryData,
    offset: queryData.offset + queryData.limit, // prefetch next page data
  });

  const handlePaginationChange = (page, pageSize) => {
    const updatedData = {
      ...queryData,
      limit: pageSize,
      offset: page === 0 ? 0 : (page - 1) * pageSize,
    };
    setQueryData(updatedData);
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

  const clearFilters = () => {
    const updatedQueryData = { ...queryData };
    Object.keys(appliedFilters).forEach((filter) => {
      delete updatedQueryData[filter];
    });
    setAppliedFilters({});
    setQueryData(updatedQueryData);
  };

  const handleCustomerDataChanges = () => {
    setQueryData({ ...queryData, sort: 'updatedAt|descend' });
    refetch();
  };

  const filterCount = Object.keys(appliedFilters).length;
  return (
    <Spin spinning={loadingCustomers}>
      <div className="view-container">
        <Row>
          <Col xs={24} md={6}>
            <Title level={2}>
              Customers&nbsp;
              <Spin
                spinning={fetchingCustomers}
                indicator={<LoadingOutlined />}
              />
            </Title>
          </Col>
          <Col xs={24} md={12} style={{ paddingTop: '10px' }}>
            <Row gutter={10}>
              <Col xs={24} md={18}>
                <Search
                  placeholder="Search name, phone, client code, notes etc."
                  allowClear
                  enterButton="Search"
                  size="large"
                  onSearch={handleSearch}
                />
              </Col>
              <Col xs={24} md={6} style={{ textAlign: 'center' }}>
                <Button size="large" onClick={() => setShowFilterModal(true)}>
                  {filterCount ? <FilterTwoTone /> : <FilterOutlined />}
                  &nbsp; Filter &nbsp;
                  {filterCount ? (
                    <Tag color="#FE7503">{filterCount}</Tag>
                  ) : null}
                </Button>
              </Col>
            </Row>
          </Col>
          <Col
            xs={24}
            md={6}
            style={{ paddingTop: '10px', textAlign: 'center' }}
          >
            <Space>
              <AdminOnly>
                <Space>
                  <ExportCustomersData queryData={queryData} />
                  <AddUpdateCustomer
                    type="ADD"
                    onChange={handleCustomerDataChanges}
                  />
                </Space>
              </AdminOnly>
            </Space>
          </Col>
        </Row>
        <Modal
          visible={showFilterModal}
          width={800}
          onCancel={() => setShowFilterModal(false)}
          footer={
            <Button onClick={() => setShowFilterModal(false)}>
              Close Dialog
            </Button>
          }
          title={
            <h2>
              {filterCount ? <FilterTwoTone /> : <FilterOutlined />}
              &nbsp; Filter Customers &nbsp;
              {filterCount ? (
                <>
                  <Tag color="#FE7503">{filterCount}</Tag> &nbsp;
                  <Button onClick={clearFilters}>Clear All</Button>{' '}
                </>
              ) : null}
            </h2>
          }
        >
          <div
            style={{ height: '60vh', overflowY: 'auto', overflowX: 'hidden' }}
          >
            <Row gutter={10}>
              <Col xs={24} md={12}>
                <DatePicker
                  style={{ width: '100%' }}
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
                  placeholder="Created on/after"
                  format={(value) =>
                    `Created on/after: ${value.format(dateDisplay)}`
                  }
                />
                <br />
                <br />
              </Col>
              <Col xs={24} md={12}>
                <DatePicker
                  style={{ width: '100%' }}
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
                  placeholder="Created on/before"
                  format={(value) =>
                    `Created till: ${value.format(dateDisplay)}`
                  }
                />
                <br />
                <br />
              </Col>
              <Col xs={24} md={12}>
                <DatePicker
                  style={{ width: '100%' }}
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
                  placeholder="Last Updated on/after"
                  format={(value) =>
                    `Updated from: ${value.format(dateDisplay)}`
                  }
                />
              </Col>
              <Col xs={24} md={12}>
                <DatePicker
                  style={{ width: '100%' }}
                  allowClear
                  value={
                    appliedFilters.updatedAtEnd
                      ? moment(appliedFilters.updatedAtEnd, 'YYYY-MM-DD')
                      : null
                  }
                  onChange={(value) =>
                    applyFilter(
                      'updatedAtEnd',
                      value ? value.format('YYYY-MM-DD') : null
                    )
                  }
                  placeholder="Last Updated on/before"
                  format={(value) =>
                    `Last Updated on/before: ${value.format(dateDisplay)}`
                  }
                />
              </Col>
            </Row>
            <br />
            <Row>
              <Col xs={24}>
                <PlatformSelector
                  width="100%"
                  value={
                    appliedFilters.platforms
                      ? appliedFilters.platforms.split(',')
                      : []
                  }
                  onChange={(value) => {
                    applyFilter('platforms', value ? value.join(',') : null);
                  }}
                />
              </Col>
            </Row>
            <br />
            <Row gutter={10}>
              <Col xs={24} md={12}>
                <Select
                  placeholder="Platform Count"
                  style={{ width: '100%' }}
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
              </Col>
              <Col xs={24} md={12}>
                <DatePicker
                  style={{ width: '100%' }}
                  allowClear
                  value={
                    appliedFilters.nextFollowUpDate
                      ? moment(appliedFilters.nextFollowUpDate, 'YYYY-MM-DD')
                      : null
                  }
                  onChange={(value) =>
                    applyFilter(
                      'nextFollowUpDate',
                      value ? value.format('YYYY-MM-DD') : null
                    )
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
                <OwnerSelector
                  width="100%"
                  onChange={(value) => {
                    applyFilter('owners', value ? value.join(',') : null);
                  }}
                  value={
                    appliedFilters.owners
                      ? appliedFilters.owners.split(',')
                      : []
                  }
                />
              </Col>
            </Row>
            <br />
            <Row>
              <Col xs={24}>
                <LabelSelector
                  width="100%"
                  onChange={(value) => {
                    applyFilter('labels', value ? value.join(',') : null);
                  }}
                  value={
                    appliedFilters.labels
                      ? appliedFilters.labels.split(',')
                      : []
                  }
                />
              </Col>
            </Row>
            <br />
          </div>
        </Modal>

        {customerData ? (
          <>
            <Row>
              <Col xs={24} md={24}>
                {customerData.customers ? (
                  <Row>
                    <Col
                      xs={24}
                      md={6}
                      style={{ paddingTop: '5px', textAlign: 'center' }}
                    >
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
                          Sort By Updates
                        </Button>
                      </Tooltip>
                    </Col>
                    <Col xs={24} md={18} style={{ textAlign: 'right' }}>
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
