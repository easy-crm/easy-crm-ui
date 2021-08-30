import { Select, Tag } from 'antd';
import React from 'react';
import useConfig from '../../util/hooks/useConfig';

const { Option } = Select;
function OwnerSelector({ onChange, value, width = 150 }) {
  const { data: config, isLoading } = useConfig();
  return (
    <Select
      mode="multiple"
      placeholder="Owners"
      style={{ width }}
      allowClear
      onChange={onChange}
      value={value}
      loading={isLoading}
    >
      {config
        ? config.admins.map((owner) => (
            <Option key={owner.email} value={owner.email}>
              <Tag>{owner.name}</Tag>
            </Option>
          ))
        : null}
    </Select>
  );
}

export default OwnerSelector;
