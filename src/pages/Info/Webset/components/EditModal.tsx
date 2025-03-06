import React, { useEffect, useRef, useState} from 'react';
import {
  ModalForm,
  ProFormDependency,
  ProFormText,
  ProFormSelect,
  ProFormSwitch,
  ProFormDigit,
} from '@ant-design/pro-components';
import { Modal, Upload } from 'antd';
import { useAccess } from 'umi';
import ImgModal from '@/pages/Adjunct/Picture/components/ImgModal';
import type { InfoItem } from './data.d';
import { tagData } from '../service';

type EditModalProps = {
  visible: boolean;
  current: Partial<InfoItem> | undefined;
  onDone: () => void;
  onSubmit: (values: InfoItem) => void;
};

const EditModal: React.FC<EditModalProps> = (props) => {
  const { visible, current, onDone, onSubmit } = props;
  const access = useAccess();
  const [showListImgModalVisible, handleShowListImgModalVisible] = useState<boolean>(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const formRef = useRef<ProFormInstance>();
  const uploadRef = useRef();
  const defFileList =  current?.value? [{
      uid: '-1',
      name: '',
      status: 'done',
      url: `${current.value}/image?size=120`,
      purl: `${current.value}/image`,
  }] : null ;

	const [buttonVisible, setButtonVisible] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>(undefined);
  const onRemove = async (file) => {
    setButtonVisible(false);
    formRef.current.setFieldsValue({
      value: '',
    });
    uploadRef.current.fileList= setFileList(undefined);
  };
  const handleOnClick = (record) => {
    setButtonVisible(true);
    formRef.current.setFieldsValue({
      value: record.image,
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
    current?.value ? setButtonVisible(true) : setButtonVisible(false);
  }, [current]);
  return (
      <ModalForm<InfoItem>
        title={current ? `编辑站点信息：${current.info}` : '添加站点信息'}
        visible={visible}
        formRef={formRef}
        onFinish={async (values) => {
          values.status = values.status ? 1 : 0;
          onSubmit(values);
        }}
        initialValues={current ? current : {status: true}}
        modalProps={{
          onCancel: () => onDone(),
          destroyOnClose: true,
        }}
      >
        <ProFormText
          name="info"
          label="信息名称"
          rules={[{ required: true, message: '请输入信息名称' }]}
          placeholder="请输入名称"
        />
        <ProFormDigit
          name="groupid"
          label="信息分组"
          rules={[{ required: true, message: '请输入信息分组' }]}
          placeholder="请输入信息分组"
        />
        <ProFormText
          name="varname"
          label="信息key"
          rules={[{ required: true, message: '请输入信息key' }]}
          placeholder="请输入信息key"
        />
        <ProFormSelect
          name="type"
          label="信息类型"
          request={async () => [
            { label: '字符', value: 'string' },
            { label: '整形', value: 'integar' },
            { label: '布尔', value: 'boolean' },
            { label: '图片', value: 'image' },
          ]}
          rules={[{ required: true, message: '请输入信息类型' }]}
          placeholder="请输入名称"
        />
        <ProFormDependency name={['type']}>
        {({type}) => {
          if(type === 'image') {
            return (
            <>
              <ProFormText
                name="value"
                label="图片"
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
              </>
            );
          }else if (type === 'integar') {
            return (
              <ProFormDigit
                name="value"
                label="信息value"
                rules={[{ required: true, message: '请输入信息分组' }]}
                placeholder="请输入信息分组"
              />
            );
          }else if (type === 'boolean') {
            return (
              <ProFormSwitch
                  name="value"
                  label="信息value"
                  rules={[{ required: true, message: '请输入信息value' }]}
                  placeholder="请输入信息value"
                />
            );
          }
          return (
              <ProFormText
                name="value"
                label="信息value"
                rules={[{ message: '请输入信息value' }]}
                placeholder="请输入信息value"
              />
            );
          
          
          
        }}
        
        </ProFormDependency>
        
        
      </ModalForm>
  );
};

export default EditModal;