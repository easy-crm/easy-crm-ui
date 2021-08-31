import { CloudDownloadOutlined } from '@ant-design/icons';
import { Button, message, Tooltip } from 'antd';
import exportFromJSON from 'export-from-json';
import moment from 'moment';

import React, { useState } from 'react';
import { useExportCustomer } from '../../util/hooks/useCustomers';

function ExportCustomersData({ queryData }) {
  const exportCustomerFn = useExportCustomer(queryData);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const exportedData = await exportCustomerFn();
      if (exportedData) {
        const data = [];
        exportedData.customers.forEach((record) => {
          const {
            name,
            phone,
            email = '',
            alternatePhone = '',
            platformInfo = [],
            labels = [],
            owner,
          } = record;
          const platforms = {};
          platformInfo.forEach((info) => {
            platforms[info.platform.name] = info.clientCode;
          });

          const row = {
            NAME: name,
            PHONE: phone,
            ALT_PHONE: alternatePhone,
            EMAIL: email,
            ...platforms,
            LABELS: labels.map((label) => label.text).join(),
            OWNER: owner.name,
          };
          data.push(row);
        });
        exportFromJSON({
          data,
          fileName: `CUSTOMER_DATA_${moment().format(
            'MMMM-Do-YYYY-h:mm a'
          )}.csv`,
          exportType: 'csv',
          withBOM: true,
        });
      }
      setExporting(false);
    } catch (error) {
      setExporting(false);
      // eslint-disable-next-line no-console
      console.error(error.message);
      message.error('Something went wrong while exporting data!');
    }
  };

  return (
    <Tooltip placement="bottom" title="Export complete data with filters">
      <Button
        size="medium"
        loading={exporting}
        onClick={handleExport}
        disabled={exporting}
      >
        <CloudDownloadOutlined /> Export Data
      </Button>
    </Tooltip>
  );
}

export default ExportCustomersData;
