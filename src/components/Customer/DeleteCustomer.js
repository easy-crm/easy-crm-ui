import {
  DeleteOutlined,
  DislikeOutlined,
  LikeOutlined,
} from '@ant-design/icons';
import { Button, message, Modal, Spin, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import createPromise from '../../util/createPromise';
import useDeleteCustomer from '../../util/hooks/useDeleteCustomer';

function DeleteCustomer({ customer, onChange }) {
  const [closePromise, setClosePromise] = useState(createPromise());
  const {
    reset: resetDeleteState,
    mutate: triggerDeleteCustomer,
    isLoading: deleting,
    isSuccess: isDeleted,
  } = useDeleteCustomer();

  const onClickDelete = () => {
    Modal.confirm({
      title: 'Delete User',
      content: (
        <Spin spinning={deleting}>
          <h2>
            Are you sure, you want to delete
            <Tag color="red">{customer.name}</Tag> ?
          </h2>
        </Spin>
      ),
      okText: 'Yes',
      cancelText: 'No',
      cancelButtonProps: { icon: <DislikeOutlined /> },
      okButtonProps: { type: 'danger', icon: <LikeOutlined /> },
      onOk: () => {
        triggerDeleteCustomer(customer._id);
        return closePromise;
      },
    });
  };

  useEffect(() => {
    if (isDeleted) {
      onChange();
      resetDeleteState();
      message.success('Customer Deleted successfully');
      closePromise.resolve();
      // reset promise
      setClosePromise(createPromise());
    }
  }, [isDeleted]);

  return (
    <Button type="danger" onClick={onClickDelete}>
      <DeleteOutlined />
    </Button>
  );
}

export default DeleteCustomer;
