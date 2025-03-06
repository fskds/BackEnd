import React, { useEffect, useRef, useState} from 'react';
import {
  ModalForm,
  ProFormText,
  ProFormUploadButton
} from '@ant-design/pro-components';
import { useAccess } from 'umi';
import type { RcFile, UploadProps } from 'antd/es/upload';
import { Modal } from 'antd';
import { Button, message, Space, Popconfirm, Upload} from 'antd';
import type { PictureListItem } from './data.d';
import { picture, updateTemp, removeTemp } from '../service';
import styles from '@/pages/style.less';

import type { UploadFile } from 'antd/es/upload/interface';

type EditModalProps = {
  visible: boolean;
  current: Partial<DynastyListItem> | undefined;
  onDone: () => void;
  onSubmit: (values: DynastyListItem) => void;
};

const EditModal: React.FC<EditModalProps> = (props) => {
  const { visible, current, onDone, onSubmit } = props;
  const formRef = useRef<ProFormInstance>();

  const [buttonVisible, setButtonVisible] = useState<boolean>(false);
  
  const [newImage, setNewImage] = useState<string>();
  
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };
  const handleCancel = () => setPreviewOpen(false);

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
  });
  const defFileList =  current? [{
      uid: '-1',
      name: current?.title,
      status: 'done',
      url: `${current.image}?size=86`,
  }] : '';
  const [fileList, setFileList] = useState<UploadFile[]>(defFileList);
  
  
  const uploadButton = (
    <div>
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const doImageUpload = async (options) => {
    const { onSuccess, onError, file, } = options;
    var formData = new FormData();
    formData.append('file', file);
    try {
      const res = await updateTemp(formData);
      onSuccess(res);
      formRef?.current?.setFieldsValue({
        image: res.data,
      });
      setNewImage(res.data);
      setButtonVisible(true)

    }catch (error) {
      onError({ error });
      return false;
    }
  }
  
  const onRemove = async (file) => {
    setButtonVisible(false);
    if(!current){
      try {
        const res = await removeTemp({name: newImage});
        message.success('删除图片成功');
        return true;
      }catch (error) {
        message.error('删除图片失败');
        return false;
    }}
    formRef.current.setFieldsValue({
      image: null,
    });
  };
  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => setFileList(newFileList);
  useEffect(() => {
    current? setButtonVisible(true) : '';
  }, [visible]);
  return (
      <ModalForm<DynastyListItem>
        title={<span className={styles.abc}>添</span>}
        visible={visible}
        formRef={formRef}
        initialValues={current}
        onFinish={async (values) => {
          onSubmit(values);
        }}
        modalProps={{
          onCancel: () => onDone(),
          destroyOnClose: true,
        }}
      >
        <ProFormText
          name="title"
          label="描述"
          rules={[{ required: true, message: '请输入标题描述' }]}
          placeholder="请输入标题描述"
        />
        <ProFormText
          name="image"
          label="图片"
          rules={[{ required: true, message: '请选择图片' }]}
        >
          <Upload
            listType="picture-card"
            maxCount={1}
            onRemove={onRemove}
            defaultFileList={defFileList}
            customRequest= {doImageUpload}
            onPreview={handlePreview}
            onChange={handleChange}
            >
            {buttonVisible ? '' : uploadButton }
          </Upload>
          <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </ProFormText>
      </ModalForm>
  );
};

export default EditModal;