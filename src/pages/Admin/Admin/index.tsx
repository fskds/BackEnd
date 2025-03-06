import React, { useRef, useState } from 'react';
import { history } from '@umijs/max';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message, Space, Tag, Popconfirm} from 'antd';
import { PlusOutlined, DeleteOutlined, CloseOutlined, RollbackOutlined } from '@ant-design/icons';
import { admin, addAdmin, updateAdmin, removeAdmin, restoreAdmin, delAdmin, assignRole, assignPermission } from './service';
import type { AdminItem, RoleAdminData, PermissionAdminData} from './data.d';
import EditModal from './components/EditModal';
import RoleModal from './components/RoleModal';
import PermissionModal from './components/PermissionModal';
import styles from '@/pages/style.less';
/**
 * 添加节点
 */
const handleAdd = async (fields: AdminItem) => {
  const hide = message.loading('正在添加');
  try {
    const res = await addAdmin({ ...fields });
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
 */
const handleUpdate = async (fields: EditModal, currentRow?: AdminItem) => {
  const hide = message.loading('正在配置');
  if (!fields) return true;
  try {
    const res = await updateAdmin({
      id: currentRow.id,
      ...fields,
    });
    hide();
    message.success(res.msg);
    if(res.msg === "成功更新管理员密码"){
      history.replace({
        pathname: '/login',
      });
    }
    
    
    
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

const handleRemove = async (selectedRows: AdminItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    const res = await removeAdmin({
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
const handleRestore = async (currentRow?: AdminItem) => {
  const hide = message.loading('正在恢复');
  if (!currentRow) return true;
  try {
    const res = await restoreAdmin({
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
const handleDelete = async (currentRow?: AdminItem) => {
  const hide = message.loading('正在删除');
  if (!currentRow) return true;
  try {
    const res = await delAdmin({
      id: currentRow.id,
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
const handleRole = async (fields: RoleAdminData, currentRow?: AdminItem) => {
  const hide = message.loading('正在修改角色');
  if (!fields) return true; 
  try {
    const res = await assignRole({
      id :currentRow.id,
      ...fields,
    });
    hide();
    message.success(res.msg);
    return true;
  } catch (error) {
    hide();
    message.error('角色更新失败请重试！');
    return false;
  }
};
const handlePermission = async (fields:PermissionAdminData , currentRow?: AdminItem) => {
  const hide = message.loading('正在修改权限');
  if (!fields) return true; 
  try {
    const res = await assignPermission({
      id : currentRow.id,
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

const AdminList: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [editModalVisible, handleEditModalVisible] = useState<boolean>(false);
  const [roleModalVisible, handleRoleModalVisible] = useState<boolean>(false);
  const [permissionModalVisible, handlePermissionModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<Partial<AdminItem> | null>(null);
  const [selectedRowsState, setSelectedRows] = useState<AdminItem[]>([]);
  const [params, setParams] = useState();
  const actionRef = useRef<ActionType>(); 
  
  const handleDone = () => {
    handleEditModalVisible(false);
    handleRoleModalVisible(false);
    handlePermissionModalVisible(false);
    setCurrentRow(null);
  };
  const columns: ProColumns<AdminItem>[] = [
    {
      title: '用户名',
      dataIndex: 'username',
      tip: '登录名称是唯一的',
    },
    {
      title: '昵称',
      dataIndex: 'name',
    },
    {
      title: '角色',
      dataIndex: 'roles',
      key: 'role',      
      hideInSearch: true,
      render(arr){
        return (
          <Space>
            {arr.map(item=>{
              return (
                <Tag key={item.display_name}>
                  {item.display_name}
                </Tag>
              );
            })}
          </Space>
        );
      }
    },
    {
      title: "操作",
      fixed: 'right' as any,
      align: 'center',
      width: 240,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) =>(params ? 
        <Space>
          <Button
            key="restore${record.id}"
            size='small'
            onClick={async() => {
              await handleRestore(record);
              actionRef.current?.reloadAndRest?.();
            }}>
            恢复
          </Button>
          <Popconfirm
            title="确定删除?"
            key="pdelete${record.id}"
            onConfirm={async () => {
              await handleDelete(record);
              actionRef.current?.reloadAndRest?.();
            }}>
            <Button
              key="delete${record.id}"
              size='small'
              type="primary" danger >
              删除
            </Button>
          </Popconfirm>
          </Space> : <Space>
          <Button
            key="update${record.id}"
            size='small'
            type="primary"
            onClick={() => {
              setCurrentRow(record);
              handleEditModalVisible(true);
            }}
          >
            编辑
          </Button>
          <Button
            key="role${record.id}"
            size='small'
            className={styles.cyan}
            onClick={() => {
              setCurrentRow(record);
              handleRoleModalVisible(true);
            }}
          >
            角色
          </Button>
          <Button
            key="permission${record.id}"
            size='small'
            className={styles.volcano}
            onClick={() => {
              setCurrentRow(record);
              handlePermissionModalVisible(true);
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
      <ProTable<AdminItem, API.PageParams>
        headerTitle={params ? 
          <Button
            type="primary"
            key="return"
            onClick={() => {
              setParams();
              actionRef.current.reloadAndRest();
            }} >
            <RollbackOutlined /> 返回
          </Button> : <Space>
          <Button
            type="primary"
            key="add"
            onClick={() => {
              setCurrentRow();
              handleEditModalVisible(true);
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
            }} >
            <Button
              key="batchDelete"
              type="primary" danger >
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
				columns={columns}
				params={params}
        request={async (
          params: T & {
            pageSize: number;
            current: number;
          },
          ) => admin({
            ...params
          })
				}
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
            const success = await handleAdd(value as AdminItem);
            if (success) {
              handleEditModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }
        }}
      />
      <RoleModal
        visible={roleModalVisible}
        current={currentRow}
        onDone={handleDone}
        onSubmit={async (value) => {
          const success = await handleRole(value, currentRow );
          if (success) {
            handleRoleModalVisible(false);
            setCurrentRow(null);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      />
      <PermissionModal
        visible={permissionModalVisible}
        current={currentRow}
        onDone={handleDone}
        onSubmit={async (value) => {
          const success = await handlePermission(value, currentRow );
          if (success) {
            handlePermissionModalVisible(false);
            setCurrentRow(null);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      />
    </PageContainer>
  );
}
export default AdminList;