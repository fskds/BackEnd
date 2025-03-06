import { PlusOutlined, DeleteOutlined, CloseOutlined, RollbackOutlined } from '@ant-design/icons';
import React, { useState, useRef }from 'react';
import {
  ProTable,
} from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { Modal, Button, message, Space, Popconfirm } from 'antd';

import type { SectionListItem } from './data.d';
import { section, addSection, updateSection, removeSection, restoreSection, delSection } from './service';
import EditModal from './components/EditModal';
import styles from '@/pages/style.less';

type SectionModalProps = {
  visible: boolean;
  current: Partial<SectionListItem> | undefined;
  onDone: () => void;
};

const handleAdd = async (fields: SectionListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addSection({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};
/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: PartModal, currentRow?: SectionListItem) => {
  const hide = message.loading('正在配置');
  if (!fields) return true;
  try {
    await updateSection({
      id: currentRow.id,
      ...fields,
    });
    hide();
    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    console.log({error});
    message.error('配置失败请重试！');
    return false;
  }
};

const handleRemove = async (selectedRows: SectionListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeSection({
      ids: selectedRows.map((row) => row.id),
    });
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败');
    return false;
  }
};
const handleRestore = async (currentRow?: SectionListItem) => {
  const hide = message.loading('正在恢复');
  if (!currentRow) return true;
  try {
    await restoreSection({
      ids: currentRow.id,
    });
    hide();
    message.success('恢复成功，返回查看');
    return true;
  } catch (error) {
    hide();
    message.error('恢复失败，再次恢复');
    return false;
  }
};
const handleDelete = async (currentRow?: SectionListItem) => {
  const hide = message.loading('不支持强行删除');
  if (!currentRow) return true;
  try {
    await delSection({
      ids: currentRow.id,
    });
    hide();
    message.success('强删除失败');
    return true;
  } catch (error) {
    hide();
    message.error('不支持强行删除');
    return false;
  }
};

const SectionModal: React.FC<SectionModalProps> = (props) => {
  const { visible, current, onDone } = props;
  const actionRef = useRef<ActionType>(); 
  const [editModalVisible, handleEditModalVisible] = useState<boolean>(false);
  const [selectedRowsState, setSelectedRows] = useState<SectionListItem[]>([]);
  const [currentRow, setCurrentRow] = useState<SectionListItem>([]);
  const [params, setParams] = useState();
  const handleEditDone = () => {
    handleEditModalVisible(false);
    setCurrentRow(undefined);
  };
  const handleCancel = () => {
    onDone();

  };
  const sectionColumns: ProColumns<SectionListItem>[] = [

    {
      title: '标题',
      dataIndex: 'title',
      ellipsis: true,
      width: 250,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      align: 'center',
      width: 50,
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: 80,
    },
    {
      title: "操作",
      fixed: 'right' as any,
      width: 120,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) =>(params ? <Space>
        <Button
          key="restore${record.id}"
          size='small'
          type="primary"
          onClick={async() => {
            await handleRestore(record);
            actionRef.current?.reloadAndRest?.();
          }}
        >恢复
        </Button>
        <Popconfirm
            title="确定删除?"
            key="pdelete${record.id}"
            onConfirm={async () => {
              await handleDelete(record);
              actionRef.current?.reloadAndRest?.();
            }}
          >
          <Button
                key="delete${record.id}"
                size='small'
                type="primary" danger 
                >删除</Button>
        </Popconfirm>
        </Space> : <Space>
        <Button
          key="update${record.id}"
          size='small'
          type="primary"
          onClick={() => {
            handleEditModalVisible(true);
            setCurrentRow(record);
          }}
        >
          编辑
        </Button>
        <Popconfirm
            title="确定删除?"
            key="premove${record.id}"
            onConfirm={async () => {
              await handleRemove([record]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
          <Button key="remove${record.id}" type="primary" danger  size='small'>删除</Button>
        </Popconfirm>
        </Space>),
    },
  ];

  return(
    <Modal
      title={current ? `编辑文章：${current.title}` : '添加文章'}
      key={current ? current.id : ''}
      visible={visible}
      closable={false}
      modalProps={{
        destroyOnClose: true,
        }}
      width={'80%'}
      getContainer={false}
      onCancel={handleCancel}
    >
      <ProTable<SectionListItem, API.PageParams>
        key='ProTable'
        search={false}
        headerTitle={params ? <Button
            type="primary"
            key="return"
            onClick={() => {
              setParams();
              actionRef.current.reloadAndRest();
            }}
          >
            <RollbackOutlined /> 返回
          </Button> : <Space><Button
            type="primary"
            key="add"
            disabled = {current ? false : true}
            onClick={() => {
              handleEditModalVisible(true);
              setCurrentRow({column_id:current.id,status:1});
              
            }}
          >
            <PlusOutlined /> 添加
          </Button>
          <Popconfirm
            title="确认删除?"
            key="pbatchDelete"
            onConfirm={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <Button
              key="batchDelete"
              type="primary" danger 
            >
              <CloseOutlined />  批量删除
            </Button>
          </Popconfirm>
          <Button
            className={styles.green}
            key="recycle"
            onClick={() => {
              setParams({model:'hasdel'});
              actionRef.current.reloadAndRest();
            }}
          >
            <DeleteOutlined /> 回收站
          </Button></Space>
        }
        style={{margin:'-24px',marginTop:'-16px'}}
        actionRef={actionRef}
        rowKey='id'
        request={async (
          params: T & {
            pageSize: number;
            current: number;
          },
          ) => section({
            page: params.current,
            pageSize: params.pageSize,
            model: params.model,
            column_id: current?.id,
        })}
        params={params}
        columns={sectionColumns}
        pagination={{
          pageSize: 10,
        }}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
        tableAlertRender={false}
      />
      <EditModal
        visible={editModalVisible}
        current={currentRow}
        onDone={handleEditDone}
        onSubmit={async (value) => {
          const method = currentRow?.id ? 'update' : 'add';
          if (method === 'update') {
            const success = await handleUpdate(value, currentRow );
            handleEditDone();
            if (success) {
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }
          if (method === 'add') {
            const success = await handleAdd(value as SectionListItem);
            if (success) {
              handleEditDone();
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }
        }}
      />
    </Modal>
  );
}
export default SectionModal;