import { Row, Spin } from 'antd';
import React from 'react';

import logo from '../../logo.png';

function LoadingScreen() {
  return (
    <Row
      justify="center"
      align="middle"
      style={{
        height: '100vh',
        width: '100vw',
        backgroundColor: '#001528',
      }}
    >
      <div>
        <img src={logo} alt="logo" />
        <Row justify="center" style={{ marginTop: '10px', fontSize: '25px' }}>
          <>
            <Spin spinning size="large" />
            &nbsp;&nbsp;
            <span style={{ color: 'white' }}>PLEASE WAIT...</span>
          </>
        </Row>
      </div>
    </Row>
  );
}

export default LoadingScreen;
