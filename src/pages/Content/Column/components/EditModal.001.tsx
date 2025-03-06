import { PlusOutlined, DeleteOutlined, CloseOutlined, RollbackOutlined } from '@ant-design/icons';
import React, { useState, useRef }from 'react';
import {
  ProTable,
  DrawerForm,
  ProCardTabs,
  ProCard,
  ProFormText,
  ProFormSelect,
  ProFormSwitch,
  ProFormDigit,
  ProFormTextArea,
  ProDescriptions,
} from '@ant-design/pro-components';
import type { ProDescriptionsActionType, ActionType, ProColumns } from '@ant-design/pro-components';
import { Drawer, Tabs, Button,  message, Space, Popconfirm } from 'antd';
import { useAccess } from 'umi';


import SectionModal from '@/pages/Content/Column/Section/index';
import { navData } from '@/pages/Menu/Nav/service';
import type { NavListItem } from '@/pages/Menu/Nav/data.d';

import type { ColumnListItem } from '../data.d';

import styles from '@/pages/style.less';
import Wangeditor from "@/components/Editor/Wangeditor";

type DrawerModalProps = {
  visible: boolean;
  current: Partial<ColumnListItem> | undefined;
  onDone: () => void;
  onSubmit: (values: ColumnListItem) => void;
};

const DrawerModal: React.FC<DrawerModalProps> = (props) => {
  const { visible, current, onDone, onSubmit } = props;
  const access = useAccess();
  const onClose = () => {
      onDone();
    };
    
  const editColumns: ProColumns<ColumnListItem>[] = [
    {
      title: '栏目标题',
      dataIndex: 'title',
      fieldProps:{ 
        style: {width: 300,},
      },
      editable: (text, record, index) => {
        return access.canAdmin? true : text? false : true;
      },
    },
    {
      title: '状态',
      dataIndex: 'state',
      valueType: 'switch',
      editable: (text, record, index) => {
        return record?.title? true : false;
      },
    },
    {
      title: '导航',
      dataIndex: 'nav_id',
      valueType: 'treeSelect',
      filterOption:false,
      fieldProps:{ 
        showSearch: true,
        filterOption:() =>{ return true } ,
        dropdownMatchSelectWidth: 300,
        style: {width: 300,},
        allowClear: true,
      },
      request: async ({ keyWords }) => {
          var res=[];
          res=navData({name:keyWords?keyWords:current?.nav?.name});
          return res;
        },
      editable: (text, record, index) => {
        return record?.title? true : false;
      },
    },
    {
      title: '关键词',
      dataIndex: 'keywords',
      fieldProps:{ 
        style: {width: 300,},
      },
      editable: (text, record, index) => {
        return record?.title? true : false;
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      valueType: 'textarea',
      fieldProps:{ 
        style: {width: 300,},
      },
      editable: (text, record, index) => {
        return record?.title? true : false;
      },      
    },
    {
      title: '缩略图',
      dataIndex: 'litpic',
      editable: (text, record, index) => {
        return record?.title? true : false;
      },
    },
    
  ];
  const EditModal: React.FC = ( ) => {
    const actionEditRef = useRef<ProDescriptionsActionType>(); 
    
    return(
      <ProDescriptions
        key='ProDescriptions'
        actionRef={actionEditRef}
        columns={editColumns}
        column={2}
        request={async () => {
          return Promise.resolve({
            success: true,
            data: current,
          });
        }}
        editable={{
          type: 'multiple',
          onSave: async (keypath, newInfo, oriInfo) => {
            newInfo.status = newInfo.status ? 1 : 0;
            onSubmit(newInfo);
            return true;
          },
        }}
        >
      </ProDescriptions>
    );
  }

  return (
    <Drawer
      title={current ? `编辑栏目：${current.title}` : '添加栏目'}
      key='edit'
      destroyOnClose
      placement="left"
      closable={false}
      modalProps={{
        destroyOnClose: true,
        }}
      open={visible}
      width={'100%'}
      getContainer={false}
      bodyStyle={{padding: 0}}
      push={{ distance: 0 }}
      extra={
        <Space>
          <Button onClick={onClose} type="primary">
            关闭
          </Button>
        </Space>
        }
    >
      <ProCard 
        className='h100'
        tabs={{
          defaultActiveKey: current?.id ? '3' : '1' ,
          tabPosition:'left',
          type:'line',
          items:[
            {
              label: '基础参数',
              key: '1',
              children: <EditModal />,
            },
            {
              label: '内容段落',
              key: '2',
              children: <SectionModal current={current} />,
              disabled: current?.id ? false : true ,
              className:'cardleft',
            },
          ],
        }}
      />
          
    </Drawer>
  );
};

export default DrawerModal;