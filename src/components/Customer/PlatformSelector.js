import { Select, Tag } from 'antd';
import React from 'react';
import useConfig from '../../util/hooks/useConfig';

const { Option } = Select;
function PlatformSelector({ onChange, value, width = 150 }) {
  const { data: config, isLoading } = useConfig();
  return (
    <Select
      mode="multiple"
      placeholder="Platforms"
      style={{ width }}
      allowClear
      onChange={onChange}
      value={value}
      loading={isLoading}
    >
      {config
        ? config.platforms.map((platform) => (
            <Option key={platform.name} value={platform.name}>
              <Tag color={platform.color}>{platform.name}</Tag>
            </Option>
          ))
        : null}
    </Select>
  );
}

export default PlatformSelector;
