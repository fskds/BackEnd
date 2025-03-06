import React from 'react';
import { ProList } from '@ant-design/pro-components';
import { List, Modal } from 'antd';
import type { PictureListItem } from '../data.d';
import { picture} from '../service';
import styles from '@/pages/style.less';

type ImgModalProps = {
  visible: boolean;
  onDone: () => void;
  handleOnClick: () => void;


};

const ImgModal: React.FC<ImgModalProps> = (props) => {
  const { visible, onDone, handleOnClick} = props;
  return (
    <Modal
      open={visible}
      closable={false}
      onCancel={() => onDone()}
      onOk={() => onDone()}
      destroyOnClose={true}
      width={824}
    >
      <ProList<PictureListItem>
        rowKey="title"
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 3,
          xl: 4,
          xxl: 4,
        }}
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 10,
        }}
        request={async (
          params: T & {
            pageSize: number;
            current: number;
          },
          ) => picture({
            page: params.current,
            pageSize: params.pageSize,
            })
          }
        onItem={(record: any) => {
          return {
            onMouseEnter: () => {
              //console.log(record);
            },
            onClick: () => {
              handleOnClick(record);
            },
          };
        }}
        metas={{
          title: {
            dataIndex: 'title',
          },
          content: {
            render: (text, row) => [
              <img key= {row.id} src={`${row.image}/image?size=130`} />
            ],
          }
        }}
        rowClassName={styles.image}
        className={styles.image}
      />
 
 
      
    </Modal>
  );
 
};

export default ImgModal;