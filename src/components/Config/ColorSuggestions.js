import { Divider, Row, Tag } from 'antd';
import React, { useState } from 'react';

function ColorSuggestions({ onClick = () => {} }) {
  const [customColor, setCustomColor] = useState('#0000');
  const suggestions = [
    'magenta',
    'red',
    'volcano',
    'orange',
    'gold',
    'lime',
    'green',
    'cyan',
    'blue',
    'geekblue',
    'purple',
    '#f50',
    '#2db7f5',
    '#87d068',
    '#108ee9',
  ];
  return (
    <div style={{ margin: '10px' }}>
      <Divider plain>Pick A Color</Divider>

      {suggestions.map((color) => {
        return (
          <Tag
            style={{ cursor: 'pointer' }}
            key={color}
            color={color}
            onClick={() => onClick(color)}
          >
            {color}
          </Tag>
        );
      })}
      <br />
      <br />
      <Row justify="center">
        <Tag>
          <strong style={{ fontSize: '15px' }}>Custome Color</strong>
          <input
            style={{ width: '100px', height: '25px', margin: '10px' }}
            type="color"
            value={customColor}
            onChange={(e) => {
              onClick(e.target.value);
              setCustomColor(e.target.value);
            }}
          />
        </Tag>
      </Row>
    </div>
  );
}

export default ColorSuggestions;
