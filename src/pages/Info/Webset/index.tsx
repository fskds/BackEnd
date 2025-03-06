import { PlusOutlined, DeleteOutlined, CloseOutlined, RollbackOutlined } from '@ant-design/icons';
import { Button, message, Badge, Space, Popconfirm} from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import React, { useRef, useState } from 'react';
import type { InfoItem } from './data.d';
import EditModal from './components/EditModal';
import { basic, addBasic, updateBasic, removeBasic, restoreBasic, delBasic } from './service';
import styles from '@/pages/style.less';
/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: InfoItem) => {
  const hide = message.loading('正在添加');
  try {
    await addBasic({ ...fields });
    hide();
    message.success('添加导航成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加导航失败请重试！');
    return false;
  }
};
/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: EditModal, currentRow?: InfoItem) => {
  const hide = message.loading('正在配置');
  if (!fields) return true;
  try {
    await updateBasic({
      id: currentRow.id,
      ...fields,
    });
    hide();
    message.success('配置导航成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置导航失败请重试！');
    return false;
  }
};

const handleRemove = async (selectedRows: InfoItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeBasic({
      ids: selectedRows.map((row) => row.id),
    });
    hide();
    message.success('删除导航成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除导航失败');
    return false;
  }
};
const handleRestore = async (currentRow?: InfoItem) => {
  const hide = message.loading('正在恢复');
  if (!currentRow) return true;
  try {
    await restoreBasic({
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
const handleDelete = async (currentRow?: InfoItem) => {
  const hide = message.loading('不支持强行删除');
  if (!currentRow) return true;
  try {
    await delBasic({
      ids: currentRow.id,
    });
    hide();
    message.success('强删除导航成功');
    return true;
  } catch (error) {
    hide();
    message.error('不支持强行删除导航');
    return false;
  }
};

const InfoItemList: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [done, setDone] = useState<boolean>(false);
  const [editModalVisible, handleEditModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<Partial<InfoItem> | undefined>(undefined);
  const [selectedRowsState, setSelectedRows] = useState<InfoItem[]>([]);
  const [params, setParams] = useState();
  const actionRef = useRef<ActionType>(); 
  
  const handleDone = () => {
    handleEditModalVisible(false);
    setCurrentRow(undefined);
  };
  const columns: ProColumns<InfoItem>[] = [
    {
      title: '信息名称',
      dataIndex: 'info',
      width: 150,
    },
    {
      title: '信息key ',
      dataIndex: 'varname',
      tip: '名称是唯一的',
      width: 100,
    },
    {
      title: '信息value',
      dataIndex: 'value',
      render: (_, record) =>{
        if(record.type === "integar") {
          return record.value;
        }else if(record.type === "boolean") {
          if (record.value === 1) {
            return (<><Badge count={0} status="success" /> True</>);
          } else {
            return (<><Badge count={0} status="error" /> False</>);
          }
        }else if(record.type === "image") {
          return record.value ? <span className={styles.img}>图片<img key={record.id} src={record.value} /></span> : null;
        }else{
          return record.value;
        }
      
      },
    },
    {
      title: '信息类型',
      dataIndex: 'type',
      width: 100,
    },
    {
      title: '信息分组',
      dataIndex: 'groupid',
      width: 100,
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
      <ProTable<InfoItem, API.PageParams>
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
          ) => basic({
            page: params.current,
            pageSize: params.pageSize,
            model: params.model,
            })}
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
            const success = await handleAdd(value as InfoItem);
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
export default InfoItemList;