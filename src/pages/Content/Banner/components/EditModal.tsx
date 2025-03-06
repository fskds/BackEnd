import React, { useEffect, useRef, useState} from 'react';
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormSwitch,
  ProFormTextArea,
  ProFormUploadButton
} from '@ant-design/pro-components';
import { useAccess } from 'umi';
import { Image, Modal, Upload } from 'antd';

import type { ArticleListItem } from './data.d';
import ImgModal from '@/pages/Adjunct/Picture/components/ImgModal';

type EditModalProps = {
  visible: boolean;
  current: Partial<ArticleListItem> | undefined;
  onDone: () => void;
  onSubmit: (values: ArticleListItem) => void;
};

const EditModal: React.FC<EditModalProps> = (props) => {
  const { visible, current, onDone, onSubmit } = props;
  const [showListImgModalVisible, handleShowListImgModalVisible] = useState<boolean>(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const access = useAccess();
  const formRef = useRef<ProFormInstance>();
  const uploadRef = useRef();
  const formItemLayout = {
          labelCol: { span: 2 },
          wrapperCol: { span: 22 },
        };
  const defFileList =  current?.litpic? [{
      uid: '-1',
      name: '',
      status: 'done',
      url: `${current.litpic}/image?size=120`,
      purl: `${current.litpic}/image`,
  }] : null ;

	const [buttonVisible, setButtonVisible] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>(undefined);
  
  const onRemove = async (file) => {
    setButtonVisible(false);
    formRef.current.setFieldsValue({
      litpic: '',
    });
    uploadRef.current.fileList= setFileList(undefined);
  };
  const handleOnClick = (record) => {
    setButtonVisible(true);
    formRef.current.setFieldsValue({
      litpic: record.image,
    });
    handleShowListImgModalVisible(false);
    uploadRef.current.fileList= setFileList([{uid: '-1',
      name: record.title,
      status: 'done',
      url: `${record.image}/image?size=120`,
      purl: `${record.image}/image`,
      }]);
  }
  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} onClick={() => { handleShowListImgModalVisible(true);}} type="button">
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.purl || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.purl!.substring(file.purl!.lastIndexOf('/') + 1));
  };
  const handleCancel = () => setPreviewOpen(false);

  useEffect(() => {
    current?.litpic ? setButtonVisible(true) : setButtonVisible(false);
  }, [current]);
  return (
      <ModalForm<ArticleListItem>
        title={current ? `编辑导航：${current.title}` : '添加导航'}
        visible={visible}
        formRef={formRef}
        onFinish={async (values) => {
          values.flag_s = values.flag_s ? 1 : 0;
          values.flag_c = values.flag_c ? 1 : 0;
          onSubmit(values);
        }}
        initialValues={current ?  current : {flag_s: true, flag_c: true}}
        modalProps={{
          onCancel: () => onDone(),
          destroyOnClose: true,
        }}
        {...formItemLayout}
        layout='horizontal'
        grid={true}

      >
        <ProFormText
          name="title"
          label="名称"
          rules={[{ required: true, message: '请输入名称' }]}
          disabled = {access.canAccess(['root']) ? false : current ? true : false}
          placeholder="请输入名称"
          colProps={{ md: 16, xl: 16}} labelCol={{span: 3}} wrapperCol={{span: 19}}
        />
        <ProFormText
          name="link"
          label="链接"
          colProps={{ md: 16, xl: 16}} labelCol={{span: 3}} wrapperCol={{span: 19}}
        />
        <ProFormTextArea
          name="html"
          label="html"
        />
        <ProFormTextArea
          name="css"
          label="css"
        />
        <ProFormText
          name="litpic"
          label="缩略图"
        >
          <Upload
            listType="picture-card"
            maxCount={1}
            ref={uploadRef}
            onRemove={onRemove}
            defaultFileList={defFileList}
            fileList={fileList}
            onPreview={handlePreview}
            beforeUpload={() => false}
            openFileDialogOnClick={false}
          >
            {buttonVisible ? '' : uploadButton }
          </Upload>
          <ImgModal
						visible={showListImgModalVisible}
						onDone={() => {	handleShowListImgModalVisible(false);}}
						handleOnClick={handleOnClick}
					/>
				</ProFormText>
        <Modal open={previewOpen} title={previewTitle} width="auto" style={{top:"20px",height: 'auto'}} footer={null} onCancel={handleCancel}>
          <img alt={previewTitle} style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </ModalForm>
      
  );
};

export default EditModal;