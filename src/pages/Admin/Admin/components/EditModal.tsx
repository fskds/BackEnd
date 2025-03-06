import React from 'react';
import {
  ModalForm,
  ProFormText,
} from '@ant-design/pro-components';
import { useAccess } from 'umi';
import type { AdminItem } from './data.d';

type OperationModalProps = {
  visible: boolean;
  current: Partial<AdminItem> | undefined;
  onDone: () => void;
  onSubmit: (values: AdminItem) => void;
};
const OperationModal: React.FC<OperationModalProps> = (props) => {
  const { visible, current, onDone, onSubmit } = props;
  const access = useAccess();
  return (
      <ModalForm<AdminItem>
        title={current ? `编辑用户：${current.username}` : '添加用户'}
        visible={visible}
        onFinish={async (values) => {
          onSubmit(values);
        }}
        initialValues={current}
        modalProps={{
          onCancel: () => onDone(),
          destroyOnClose: true,
        }}

      >
        <ProFormText
          name="username"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名' }]}
          disabled = {access.canAccess(['root']) ? false : current ? true : false}
          placeholder="请输入用户名"
        />
        <ProFormText
          name="name"
          label="昵称"
        />
        <ProFormText
          name="mobile"
          label="电话"
        />
        <ProFormText
          name="email"
          label="邮箱"
          rules={[{ required: true, message: '请输入邮箱' }]}
          placeholder="请输入"
        />
        <ProFormText
          name="password"
          label="密码"
          disabled = {access.canAccess(['root']) ? false : current ? true : false}
        />

      </ModalForm>

  );
};

export default OperationModal;
  
  

