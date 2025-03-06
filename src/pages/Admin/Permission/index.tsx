import { PlusOutlined, DeleteOutlined, CloseOutlined, RollbackOutlined } from '@ant-design/icons';
import { Button, message, Space, Popconfirm} from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import React, { useRef, useState } from 'react';
import type { PermissionItem } from './data.d';
import EditModal from './components/EditModal';
import { permission, addPermission, updatePermission, removePermission, restorePermission, delPermission } from './service';
import styles from '@/pages/style.less';
/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: PermissionItem) => {
  const hide = message.loading('正在添加权限');
  try {
    const res = await addPermission({ ...fields });
    hide();
    message.success(res.msg);
    return true;
  } catch (error) {
    hide();
    message.error('添加权限失败请重试！');
    return false;
  }
};
/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: PermissionItem, currentRow?: PermissionItem) => {
  const hide = message.loading('正在配置权限');
  if (!fields) return true;
  try {
    const res = await updatePermission({
      id : currentRow.id,
      ...fields,
    });
    hide();
    message.success(res.msg);
    return true;
  } catch (error) {
    hide();
    message.error('配置权限失败请重试！');
    return false;
  }
};

const handleRemove = async (selectedRows: PermissionItem[]) => {
  const hide = message.loading('正在删除权限');
  if (!selectedRows) return true;
  try {
    const res = await removePermission({
      ids: selectedRows.map((row) => row.id),
    });
    hide();
    message.success(res.msg);
    return true;
  } catch (error) {
    hide();
    message.error('删除权限失败请重试！');
    return false;
  }
};
const handleRestore = async (currentRow?: PermissionItem) => {
  const hide = message.loading('正在恢复权限');
  if (!currentRow) return true;
  try {
    const res = await restorePermission({
      id: currentRow.id,
    });
    hide();
    message.success(res.msg);
    return true;
  } catch (error) {
    hide();
    message.error('恢复权限失败请重试！');
    return false;
  }
};
const handleDelete = async (currentRow?: PermissionItem) => {
  const hide = message.loading('正在强制删除权限');
  if (!currentRow) return true;
  try {
    const res = await delPermission({
      id: currentRow.id,
    });
    hide();
    message.success(res.msg);
    return true;
  } catch (error) {
    hide();
    message.error('强制删除权限失败请重试！');
    return false;
  }
};

const PermissionList: React.FC = () => {
  const [editModalVisible, handleEditModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<Partial<PermissionItem> | undefined>(undefined);
  const [selectedRowsState, setSelectedRows] = useState<PermissionItem[]>([]);
  const [params, setParams] = useState();
  const actionRef = useRef<ActionType>(); 
  
  const handleDone = () => {
    handleEditModalVisible(false);
    setCurrentRow(undefined);
  };
  const columns: ProColumns<PermissionItem>[] = [
    {
      title: '权限名',
      dataIndex: 'name',
      tip: '名称是唯一的',
    },
    {
      title: '名称',
      dataIndex: 'display_name',
    },
    {
      title: '路由',
      dataIndex: 'route',
    },
    {
      title: '图标',
      dataIndex: 'icon',
    },
    {
      title: "操作",
      fixed: 'right' as any,
      align: 'center',
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

  return (
    <PageContainer>
      <ProTable<PermissionItem>
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
            onClick={() => {
              handleEditModalVisible(true);
              setCurrentRow();
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
        actionRef={actionRef}
        rowKey='id'
        request={async (
          params: T & {
            pageSize: number;
            current: number;
          },
          ) => permission({
            ...params
            })}
        params={params}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
            
          },
        }}
      />
      <EditModal
        visible={editModalVisible}
        current={currentRow}
        onDone={handleDone}
        onSubmit={async (value) => {
          const method = currentRow?.id ? 'update' : 'add';
          if (method === 'update') {
            const success = await handleUpdate(value, currentRow );
            if (success) {
              handleEditModalVisible(false);
              setCurrentRow(undefined);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }
          if (method === 'add') {
            const success = await handleAdd(value as PermissionItem);
            if (success) {
              handleEditModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }
        }}
      />
    </PageContainer>
  );
}
export default PermissionList;