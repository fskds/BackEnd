import React, { useEffect, useState, useRef } from 'react';
import {
  ProCard,
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormSwitch,
  ProFormDigit,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Row, Col, Modal, Button, Space, Upload } from 'antd';

import Wangeditor from "@/components/Editor/Wangeditor";
import ImgModal from '@/pages/Adjunct/Picture/components/ImgModal';
import type { SectionListItem } from '../data.d';
import styles from '@/pages/style.less';


type EditModalProps = {
  visible: boolean;
  current: Partial<SectionListItem> | undefined;
  onDone: () => void;
  onSubmit: (values: SectionListItem) => void;
};

const EditModal: React.FC<EditModalProps> = (props) => {
  const { visible, current, onDone, onSubmit } = props;
  const [showListImgModalVisible, handleShowListImgModalVisible] = useState<boolean>(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const formRef = useRef<ProFormInstance>();
  const uploadRef = useRef();
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
      litpic: null,
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
  const onClose = () => {
    onDone();
  };
  
  return (
    <ModalForm
      title={current?.id ? `编辑段落：${current.name}` : '添加段落'}
      key={current ? current.id : ''}
      visible={visible}
      formRef={formRef}
      onFinish={async (values) => {
        onSubmit(values);
      }}
      modalProps={{
        destroyOnClose: true,
        onCancel: () =>onDone(),
      }}
      layout='horizontal'
        grid={true}
      initialValues={current ? current : {status: true,ts: true}}
    >

        <ProFormText name="column_id" label="栏目id" hidden />
        <ProFormText name="title" label="标题" rules={[{ required: true, message: '请输入' }]} colProps={{ md: 16, xl: 16}} labelCol={{span: 3}} wrapperCol={{span: 21}} />
        <ProFormText name="nameEn" label="css名称" colProps={{ md: 8, xl: 8}} labelCol={{span: 6}} wrapperCol={{span: 18}} />
        <ProFormText name="h2" label="h2" colProps={{ md: 12, xl: 12}} labelCol={{span: 4}} wrapperCol={{span: 20}} />
        <ProFormText name="span" label="span" colProps={{ md: 12, xl: 12}} labelCol={{span: 4}} wrapperCol={{span: 20}} />
        <ProFormText name="description" label="描述" colProps={{ md: 24, xl: 24}} labelCol={{span: 2}} wrapperCol={{span: 22}}  />
        <ProFormTextArea name="html" label="HTML" rules={[{ required: true, message: '请输入' }]} colProps={{ md: 24, xl: 24}} labelCol={{span: 2}} wrapperCol={{span: 22}}  />
        <ProFormTextArea name="css" label="CSS" colProps={{ md: 12, xl: 12}} labelCol={{span: 4}} wrapperCol={{span: 20}}  />
        <ProFormTextArea name="js" label="JS" colProps={{ md: 12, xl: 12}} labelCol={{span: 4}} wrapperCol={{span: 20}}  />
        <ProFormSwitch name="sbi" label="背景图" valuePropName="checked"  getValueFromEvent={(checked) => checked ? 1 : 0} colProps={{ md: 8, xl: 8}} labelCol={{span: 6}} wrapperCol={{span: 8}}/>
        <ProFormSwitch name="scw" label="宽度" valuePropName="checked"  getValueFromEvent={(checked) => checked ? 1 : 0} colProps={{ md: 8, xl: 8}} labelCol={{span: 6}} wrapperCol={{span: 8}}/>
        <ProFormSwitch name="stc" label="title颜色" valuePropName="checked"  getValueFromEvent={(checked) => checked ? 1 : 0} colProps={{ md: 8, xl: 8}} labelCol={{span: 6}} wrapperCol={{span: 8}}/>
        <ProFormDigit name="sort" label="排序" colProps={{ md: 8, xl: 8}} labelCol={{span: 6}} wrapperCol={{span: 8}}/>
        <ProFormSwitch name="status" label="状态" valuePropName="checked"  getValueFromEvent={(checked) => checked ? 1 : 0} colProps={{ md: 8, xl: 8}} labelCol={{span: 6}} wrapperCol={{span: 8}}/>
        
        <ProFormText
          name="litpic"
          label="缩略图"
          colProps={{ md: 24, xl: 24}} labelCol={{span: 2}} wrapperCol={{span: 22}} 
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
  
  

