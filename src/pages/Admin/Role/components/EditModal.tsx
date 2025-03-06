import React from 'react';
import {
  ModalForm,
  ProFormText,
} from '@ant-design/pro-components';
import type { RoleItem } from './data.d';
import { useAccess } from 'umi';

type OperationModalProps = {
  visible: boolean;
  current: Partial<RoleItem> | undefined;
  onDone: () => void;
  onSubmit: (values: RoleItem) => void;
};


const OperationModal: React.FC<OperationModalProps> = (props) => {
  const { visible, current, onDone, onSubmit } = props;
  const access = useAccess();
  return (
      <ModalForm<RoleItem>
        title={current ? `编辑角色：${current.display_name}` : '添加角色'}
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
          name="name"
          label="角色名"
          rules={[{ required: true, message: '请输入角色名' }]}
          disabled = {access.canAccess(['root']) ? false : current ? true : false}
          placeholder="请输入角色名"
        />
        <ProFormText
          name="display_name"
          label="名称"
        />
      </ModalForm>

  );
};

export default OperationModal;
  
  

