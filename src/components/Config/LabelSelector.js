import { Select, Tag } from 'antd';
import React from 'react';
import useConfig from '../../util/hooks/useConfig';

const { Option } = Select;
function LabelSelector({ onChange, value, width = 150 }) {
  const { data: config, isLoading } = useConfig();
  return (
    <Select
      mode="multiple"
      placeholder="Labels"
      style={{ width }}
      allowClear
      onChange={onChange}
      value={value}
      loading={isLoading}
    >
      {config
        ? config.labels.map((label) => (
            <Option key={label.text} value={label.text}>
              <Tag color={label.color}>{label.text}</Tag>
            </Option>
          ))
        : null}
    </Select>
  );
}

export default LabelSelector;
