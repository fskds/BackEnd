import React,{ useRef } from 'react';
import {
  ModalForm,
  ProFormText,
  ProFormDigit,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import type { PermissionItem } from './data.d';
import { permissionData } from '../service';
import { useAccess } from 'umi';

type EditModalProps = {
  visible: boolean;
  current: Partial<PermissionItem> | undefined;
  onDone: () => void;
  onSubmit: (values: PermissionItem) => void;
};

const EditModal: React.FC<EditModalProps> = (props) => {
  const { visible, current, onDone, onSubmit } = props;
  const access = useAccess();
  const formRef = useRef<ProFormInstance>();
  const onChange = (newValue: string) => {
    formRef?.current?.setFieldsValue({
      pid: newValue,
    });
  };
  return (
      <ModalForm<PermissionItem>
        title={current ? `编辑权限：${current.display_name}` : '添加权限'}
        visible={visible}
        onFinish={async (values) => {
          onSubmit(values);
        }}
        
        formRef={formRef}
        initialValues={current}
        modalProps={{
          onCancel: () => onDone(),
          destroyOnClose: true,
        }}

      >
        <ProFormTreeSelect
          name="pidSelect"
          label="父级"
          placeholder="请选择父级菜单"
          allowClear
          debounceTime={2000}
          value={current ? current.pid : 0}
          onChange={onChange}
          disabled = {access.canAccess(['root']) ? false : current ? true : false}
          request={async (params) => permissionData(params)}
          />
      
        <ProFormText
          name="pid"
          hidden
        />
        <ProFormText
          name="name"
          label="权限名"
          rules={[{ required: true, message: '请输入权限名' }]}
          disabled = {access.canAccess(['root']) ? false : current ? true : false}
          placeholder="请输入权限名"
        />
        <ProFormText
          name="display_name"
          label="名称"
        />
        <ProFormText
          name="route"
          label="路由"
        />
        <ProFormText
          name="icon"
          label="图标"
        />
        <ProFormDigit
          name="sort"
          label="排序"
        />

      </ModalForm>

  );
};

export default EditModal;
  
  

