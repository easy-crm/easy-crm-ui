import { Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

function CustomInputLabel({ icon, text, required }) {
  return (
    <span>
      <Text type="secondary">
        {icon} {text}
      </Text>
      {required ? <Text type="danger">&nbsp;*</Text> : null}
    </span>
  );
}

export default CustomInputLabel;
