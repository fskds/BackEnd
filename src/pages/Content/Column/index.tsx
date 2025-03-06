import { PlusOutlined, DeleteOutlined, CloseOutlined, RollbackOutlined } from '@ant-design/icons';
import { Button, message, Badge, Space, Popconfirm} from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import React, { useRef, useState } from 'react';
import type { ColumnItem } from './data.d';
import EditModal from './components/EditModal';
import SectionModal from './Section/index';
import { column, addColumn, updateColumn, removeColumn, restoreColumn, delColumn } from './service';
import styles from '@/pages/style.less';
/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: ColumnItem) => {
  const hide = message.loading('正在添加');
  try {
    await addColumn({ ...fields });
    hide();
    message.success('添加页面成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加页面失败请重试！');
    return false;
  }
};
/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: EditModal, currentRow?: ColumnItem) => {
  const hide = message.loading('正在配置');
  if (!fields) return true;
  try {
    await updateColumn({
      id: currentRow.id,
      ...fields,
    });
    hide();
    message.success('配置页面成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置页面失败请重试！');
    return false;
  }
};

const handleRemove = async (selectedRows: ColumnItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeColumn({
      ids: selectedRows.map((row) => row.id),
    });
    hide();
    message.success('删除页面成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除页面失败');
    return false;
  }
};
const handleRestore = async (currentRow?: ColumnItem) => {
  const hide = message.loading('正在恢复');
  if (!currentRow) return true;
  try {
    await restoreColumn({
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
const handleDelete = async (currentRow?: ColumnItem) => {
  const hide = message.loading('不支持强行删除');
  if (!currentRow) return true;
  try {
    await delColumn({
      ids: currentRow.id,
    });
    hide();
    message.success('强删除页面成功');
    return true;
  } catch (error) {
    hide();
    message.error('不支持强行删除页面');
    return false;
  }
};

const ColumnList: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [done, setDone] = useState<boolean>(false);
  const [editModalVisible, handleEditModalVisible] = useState<boolean>(false);
  const [sectionModalVisible, handleSectionModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<Partial<ColumnItem> | undefined>(undefined);
  const [selectedRowsState, setSelectedRows] = useState<ColumnItem[]>([]);
  const [params, setParams] = useState();
  const actionRef = useRef<ActionType>(); 
  
  const handleDone = () => {
    handleEditModalVisible(false);
    handleSectionModalVisible(false);
    setCurrentRow({});
  };
  const columns: ProColumns<ColumnItem>[] = [
    {
      title: '导航',
      dataIndex: 'nav',
      search: false,
      width: 120,
      render(arr){
        return (
          arr?.name
        );
      }
    },
    {
      title: '页面标题',
      dataIndex: 'title',
      tip: '名称是唯一的',
      width: 150,
    },
    {
      title: '关键词',
      dataIndex: 'keywords',
      search: false,
      align: 'center',
      width: 250,
    },
    {
      title: '描述',
      dataIndex: 'description',
      search: false,
      align: 'center',
      
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
        <Button
          key="section${record.id}"
          type="primary"
          className={styles.cyan}
          size='small'
          onClick={() => {
            handleSectionModalVisible(true);
            setCurrentRow(record);
          }}
        >
          区块
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
      <ProTable<ColumnItem, API.PageParams>
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
                setCurrentRow(undefined);
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
            columnSize: number;
            current: number;
          },
          ) => column({... params})}
        params={params}
        columns={columns}
        pagination={{
          columnSize: 10,
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
            const success = await handleAdd(value as ColumnItem);
            if (success) {
              handleEditModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }
        }}
      />
      <SectionModal
        visible={sectionModalVisible}
        current={currentRow}
        onDone={handleDone}
      />
    </PageContainer>
    );
}
export default ColumnList;