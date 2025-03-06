import React from 'react';
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormSwitch,
  ProFormDigit,
} from '@ant-design/pro-components';
import { useAccess } from 'umi';

import type { NavListItem } from './data.d';
import { navData } from '../service';

type EditModalProps = {
  visible: boolean;
  current: Partial<NavListItem> | undefined;
  onDone: () => void;
  onSubmit: (values: NavListItem) => void;
};

const EditModal: React.FC<EditModalProps> = (props) => {
  const { visible, current, onDone, onSubmit } = props;
  const access = useAccess();
  
  return (
      <ModalForm<NavListItem>
        title={current ? `编辑导航：${current.name}` : '添加导航'}
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
          rules={[{ required: true, message: '请输入导航名称' }]}
          disabled = {access.canAccess(['root']) ? false : current ? true : false}
          placeholder="请输入名称"
        />
        <ProFormText
          name="path"
          label="链接页面"
        />
        <ProFormSelect
          name="pid"
          label="父级"
          fieldProps= {{
            showSearch: true,
            filterOption:() =>{ return true },
            fieldNames: {
              label: 'title',
              value: 'id',
            },
          }}
          request= {async ({ keyWords }) => {
            var res=[];
            res=navData({name:keyWords?keyWords:current?.nav?.name});
            return res;
          }}
        />
        <ProFormDigit
          name="sort"
          label="排序"
        />
        <ProFormSwitch
          name="status"
          label="状态"
        />
      </ModalForm>
  );
};

export default EditModal;