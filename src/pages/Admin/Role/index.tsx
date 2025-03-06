import { PlusOutlined, DeleteOutlined, CloseOutlined, RollbackOutlined } from '@ant-design/icons';
import { Button, message, Space, Popconfirm} from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import React, { useRef, useState } from 'react';
import type { RoleItem, PermissionRoleData } from './data.d';
import EditModal from './components/EditModal';
import PermissionModal from './components/PermissionModal';
import { role, addRole, updateRole, removeRole, restoreRole, delRole, assignPermission } from './service';
import styles from '@/pages/style.less';
/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: RoleItem) => {
  const hide = message.loading('正在添加');
  try {
    const res = await addRole({ ...fields });
    hide();
    message.success(res.msg);
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
const handleUpdate = async (fields: EditModal,  currentRow?: RoleItem ) => {
  const hide = message.loading('正在配置');
  if (!fields) return true;
  try {
    const res = await updateRole({
      id: currentRow.id,
      ...fields,
    });
    hide();
    message.success(res.msg);
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

const handleRemove = async (selectedRows: RoleItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    const res = await removeRole({
      ids: selectedRows.map((row) => row.id),
    });
    hide();
    message.success(res.msg);
    return true;
  } catch (error) {
    hide();
    message.error('删除失败请重试！');
    return false;
  }
};
const handleRestore = async (currentRow?: RoleItem) => {
  const hide = message.loading('正在恢复');
  if (!currentRow) return true;
  try {
    const res = await restoreRole({
      id: currentRow.id,
    });
    hide();
    message.success(res.msg);
    return true;
  } catch (error) {
    hide();
    message.error('恢复失败请重试！');
    return false;
  }
};
const handleDelete = async (currentRow?: RoleItem) => {
  const hide = message.loading('正在删除');
  if (!currentRow) return true;
  try {
    const res = await delRole({
      id: currentRow.id,
    });
    hide();
    message.success(res.msg);
    return true;
  } catch (error) {
    hide();
    message.error('强制删除失败请重试！');
    return false;
  }
};
const handlePermission = async (fields: PermissionRoleData, currentRow?: RoleItem) => {
  const hide = message.loading('正在修改权限');
  if (!fields) return true; 
  console.log(fields);
  try {
    const res = await assignPermission({
      id: currentRow.id,
      ...fields,
    });
    hide();
    message.success(res.msg);
    return true;
  } catch (error) {
    hide();
    message.error('修改权限失败请重试！');
    return false;
  }
};

const RoleList: React.FC = () => {
  const [editModalVisible, handleEditModalVisible] = useState<boolean>(false);
  const [permissionModalVisible, handlePermissionModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<Partial<RoleItem> | null>(null);
  const [selectedRowsState, setSelectedRows] = useState<RoleItem[]>([]);
  const [params, setParams] = useState();
  const actionRef = useRef<ActionType>(); 
  
  const handleDone = () => {
    handleEditModalVisible(false);
    handlePermissionModalVisible(false);
    setCurrentRow(null);
  };

  const columns: ProColumns<RoleItem>[] = [
    {
      title: '角色名',
      dataIndex: 'name',
      tip: '角色名称是唯一的',
      onFilter: (value, record) => record.name === value,
    },
    {
      title: '名称',
      dataIndex: 'display_name',
    },
    
    {
      title: "操作",
      fixed: 'right' as any,
      align: 'center',
      width: 180,
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
        <Button
          key="permission${record.id}"
          size='small'
          className={styles.volcano}
          onClick={() => {
            handlePermissionModalVisible(true);
            setCurrentRow(record);
          }}
        >
          权限
        </Button>
        <Popconfirm
            title="确定删除?"
            key="premove${record.id}"
            onConfirm={async () => {
              await handleRemove([record]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
          <Button key="remove${record.id}" type="primary" danger size='small'>删除</Button>
        </Popconfirm>
        </Space>),
    },
  ];

  return (
    <PageContainer>
      <ProTable<RoleItem, API.PageParams>
        headerTitle={params?.model==='hasdel' ? 
          <Button
            type="primary"
            key="return"
            onClick={() => {
              setParams(null);
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
          ) =>{
            const { name, ...otherParams } = params; // 从参数中解构出搜索关键字
            const searchParams = {
              ...otherParams,
              // 其他请求参数配置
            };
            if (name) {
              setParams({model:'search'});
              // 如果有搜索关键字，则在这里对数据进行过滤
              // 比如使用关键字过滤数据
              //searchParams.name = name;
            }
            const data = role({
              ...params,
              });
            return data;
          }
        }
        pagination={{
          pageSize: 10, // 设置每页展示的数据条数
          //showSizeChanger: true, // 是否显示 pageSize 切换器，用于选择不同的 pageSize
          //pageSizeOptions: ['10', '20', '30', '40'], // 指定每页可以显示多少条
          //showQuickJumper: true, // 是否可以快速跳转至某页
          //showTotal: (total) => `共 ${total} 条`, // 用于显示总共有多少条数据
        }}
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
              setCurrentRow(null);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }
          if (method === 'add') {
            const success = await handleAdd(value as RoleItem);
            if (success) {
              handleEditModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }
          
          
        }}
      />
      <PermissionModal
        visible={permissionModalVisible}
        current={currentRow}
        onDone={handleDone}
        onSubmit={async (value) => {
          const success = await handlePermission(value, currentRow);
          if (success) {
            handlePermissionModalVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      />
    </PageContainer>
    );
}
export default RoleList;