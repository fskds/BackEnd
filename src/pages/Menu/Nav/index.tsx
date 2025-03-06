import { PlusOutlined, DeleteOutlined, CloseOutlined, RollbackOutlined } from '@ant-design/icons';
import { Button, message, Badge, Space, Popconfirm} from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import React, { useRef, useState } from 'react';
import type { NavItem } from './data.d';
import EditModal from './components/EditModal';
import { nav, addNav, updateNav, removeNav, restoreNav, delNav } from './service';
import styles from '@/pages/style.less';


/**
 * 添加节点
 */
const handleAdd = async (fields: NavItem) => {
  const hide = message.loading('正在添加');
  try {
    const res = await addNav({ ...fields });
    hide();
    message.success(res.msg);
    return true;
  } catch (error) {
    hide();
    message.error('添加导航失败请重试！');
    return false;
  } 
};
/**
 * 更新节点
 */
const handleUpdate = async (fields: EditModal, currentRow?: NavItem) => {
  const hide = message.loading('正在配置');
  if (!fields) return true;
  try {
    const res = await updateNav({
      id: currentRow.id,
      ...fields,
    });
    hide();
    message.success(res.msg);
    return true;
  } catch (error) {
    hide();
    message.error('配置导航失败请重试！');
    return false;
  } 
};

const handleRemove = async (selectedRows: NavItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    const res = await removeNav({
      ids: selectedRows.map((row) => row.id),
    });
    hide();
    message.success(res.msg);
    return true;
  } catch (error) {
    hide();
    messageApi.error('删除导航失败请重试！');
    return false;
  }
};
const handleRestore = async (currentRow?: NavItem) => {
  const hide = message.loading('正在恢复');
  if (!currentRow) return true;
  try {
    const res = await restoreNav({
      id: currentRow.id,
    });
    hide();
    message.success(res.msg);
    return true;
  } catch (error) {
    hide();
    message.error('恢复导航失败请重试！');
    return false;
  }
};
const handleDelete = async (currentRow?: NavItem) => {
  const hide = message.loading('正在强行删除');
  if (!currentRow) return true;
  try {
    const res = await delNav({
      id: currentRow.id,
    });
    hide();
    message.success(res.msg);
    return true;
  } catch (error) {
    hide();
    message.error('强行删除导航失败请重试！');
    return false;
  }
};
const NavList: React.FC = () => {
  const [editModalVisible, handleEditModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<Partial<NavItem> | undefined>(undefined);
  const [selectedRowsState, setSelectedRows] = useState<NavItem[]>([]);
  const [params, setParams] = useState();
  const actionRef = useRef<ActionType>(); 
  const handleDone = () => {
    handleEditModalVisible(false);
    setCurrentRow(undefined);
  };
  const columns: ProColumns<NavItem>[] = [
    {
      title: '栏目名称',
      dataIndex: 'name',
      tip: '名称是唯一的',
      width: 250,
    },
    {
      title: '链接地址',
      dataIndex: 'path',
      hideInSearch: true,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      hideInSearch: true,
      align: 'center',
      width: 80,
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInSearch: true,
      align: 'center',
      render:(text, record, index)=>{
        if( record.deleted_at){
          return "已删除";
        }else{
          if (record.status === 1) {
            return (<Badge count={0} status="success" />);
          } else {
            return (<Badge count={0} status="error" />);
          }
        }
      },
      width: 80,
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
          type="primary"
          size='small'
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
          <Button key="remove${record.id}" type="primary" danger size='small'>删除</Button>
        </Popconfirm>
        </Space>
        ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<NavItem, API.PageParams>
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
                type="primary"
                danger
              >
                <CloseOutlined />  批量删除
              </Button>
            </Popconfirm>
            <Button
              key="recycle"
              className={styles.green}
              onClick={() => {
                setParams({model:'hasdel'});
                actionRef.current.reloadAndRest();
              }}
            >
              <DeleteOutlined /> 回收站
            </Button>
            </Space>
        }
        actionRef={actionRef}
        rowKey='id'
        request={async (
          params: T & {
            pageSize: number;
            current: number;
          },
          ) => nav({... params})}
        params={params}
        columns={columns}
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
            const success = await handleAdd(value as NavItem);
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
export default NavList;