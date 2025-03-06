import React from 'react';
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormSwitch,
  ProFormDigit,
} from '@ant-design/pro-components';
import { useAccess } from 'umi';

import type { TagListItem } from './data.d';
import { tagData } from '../service';

type EditModalProps = {
  visible: boolean;
  current: Partial<TagListItem> | undefined;
  onDone: () => void;
  onSubmit: (values: TagListItem) => void;
};

const EditModal: React.FC<EditModalProps> = (props) => {
  const { visible, current, onDone, onSubmit } = props;
  const access = useAccess();
  
  return (
      <ModalForm<TagListItem>
        title={current ? `编辑标题：${current.name}` : '添加标题'}
        visible={visible}
        onFinish={async (values) => {
          values.status = values.status ? 1 : 0;
          onSubmit(values);
        }}
        initialValues={current ? current : {status: true}}
        modalProps={{
          onCancel: () => onDone(),
          destroyOnClose: true,
        }}
      >
        <ProFormText
          name="name"
          label="名称"
          rules={[{ required: true, message: '请输入标题名称' }]}
          disabled = {access.canAccess(['root']) ? false : current ? true : false}
          placeholder="请输入名称"
        />
        <ProFormSwitch
          name="status"
          label="状态"
        />
      </ModalForm>
  );
};

export default EditModal;