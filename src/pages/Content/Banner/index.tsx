import { PlusOutlined, DeleteOutlined, CloseOutlined, RollbackOutlined } from '@ant-design/icons';
import { Button, message, Space, Tag,Popconfirm} from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import React, { useRef, useState } from 'react';
import type { BannerListItem } from './data.d';
import EditModal from './components/EditModal';
import { banner, addBanner, updateBanner, removeBanner, restoreBanner, delBanner } from './service';
import styles from '@/pages/style.less';
/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: BannerListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addBanner({ ...fields });
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
const handleUpdate = async (fields: EditModal, currentRow?: BannerListItem) => {
  const hide = message.loading('正在配置');
  if (!fields) return true;
  try {
    await updateBanner({
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

const handleRemove = async (selectedRows: BannerListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeBanner({
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
const handleRestore = async (currentRow?: BannerListItem) => {
  const hide = message.loading('正在恢复');
  if (!currentRow) return true;
  try {
    await restoreBanner({
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
const handleDelete = async (currentRow?: BannerListItem) => {
  const hide = message.loading('不支持强行删除');
  if (!currentRow) return true;
  try {
    await delBanner({
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

const BannerList: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [done, setDone] = useState<boolean>(false);
  const [editModalVisible, handleEditModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<Partial<BannerListItem> | undefined>(undefined);
  const [selectedRowsState, setSelectedRows] = useState<BannerListItem[]>([]);
  const [params, setParams] = useState();
  const actionRef = useRef<ActionType>(); 
  
  const handleDone = () => {
    handleEditModalVisible(false);
    setCurrentRow(undefined);
  };
  const columns: ProColumns<BannerItem>[] = [
    {
      title: '文章标题',
      dataIndex: 'title',
      width: 300,
    },
    {
      title: '链接',
      dataIndex: 'link',
    },
    {
      title: '缩略图',
      dataIndex: 'litpic',
      search: false,
      align: 'center',
      width: 300,
      render: (_, record) => {
        return record.litpic ? <img key={record.id} src={`${record.litpic}/image?size=120`} /> : null;
      },
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
      <ProTable<BannerItem, API.PageParams>
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
            columnSize: number;
            current: number;
          },
          ) => banner({... params})}
        // request={async (
          // params: T & {
            // pageSize: number;
            // current: number;
          // },
          // ) => { const res = await banner({
            // page: params.current,
            // pageSize: params.pageSize,
            // model: params.model,
            // });
            // let data = res.data.map(item=>{
              // let tag = item.tag.map(itemt=>{
                // return {value:itemt.id,label:itemt.name};
                // })
              // item.tag = tag;
             // return item;
            // })
            // return {
              // data: data,
    //          success 请返回 true，
    //          不然 table 会停止解析数据，即使有数据
              // success: res.success,
    //          不传会使用 data 的长度，如果是分页一定要传
              // total: res.total,
            // };
              // }
        // }
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
            const success = await handleAdd(value as BannerListItem);
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
export default BannerList;