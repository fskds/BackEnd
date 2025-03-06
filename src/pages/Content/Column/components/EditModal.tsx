import React, { useEffect, useState, useRef }from 'react';
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormSwitch,
} from '@ant-design/pro-components';
import { Button, Modal, message, Upload, IconPicker } from 'antd';
import { useAccess } from 'umi';

import { bannerData } from '@/pages/Content/Banner/service';
import { navData } from '@/pages/Menu/Nav/service';
import type { NavListItem } from '@/pages/Menu/Nav/data.d';

import type { ColumnListItem } from '../data.d';
import ImgModal from '@/pages/Adjunct/Picture/components/ImgModal';
import styles from '@/pages/style.less';

type EditModalProps = {
  visible: boolean;
  current: Partial<ColumnListItem> | undefined;
  onDone: () => void;
  onSubmit: (values: ColumnListItem) => void;
};
const EditModal: React.FC<EditModalProps> = (props) => {
  const { visible, current, onDone, onSubmit } = props;
  const [showListImgModalVisible, handleShowListImgModalVisible] = useState<boolean>(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
 const [selectedBannerIds, setSelectedBannerIds] = useState([]); 
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
  

  
  return (
      <ModalForm<ColumnListItem>
        title={current ? `编辑导航栏目：${current.title}` : '添加导航栏目'}
        visible={visible}
        formRef={formRef}
        onFinish={async (values) => {
          values.status = values.status ? 1 : 0;
          onSubmit(values);
        }}
        initialValues={current ? {
        ...current,
        // 在编辑模式下将当前数据的 banner 字段作为默认值传递给 ProFormSelect 组件
        banner: current.banner ? current.banner.map((b) => b.id) : [],
      } : {status: true}}
        modalProps={{
          onCancel: () => {onDone();setFileList(undefined);},
          destroyOnClose: true,
        }}
        {...formItemLayout}
        layout='horizontal'
        grid={true}

      >
        <ProFormText
          name="title"
          label="标题"
          rules={[{ required: true, message: '请输入导航名称' }]}
          disabled = {access.canAccess(['root']) ? false : current ? true : false}
          placeholder="请输入名称"
          colProps={{ md: 16, xl: 16}} labelCol={{span: 3}} wrapperCol={{span: 19}}
        />
        <ProFormSelect
          name="nav_id"
          label="导航"
          fieldProps= {{ showSearch: true,filterOption:() =>{ return true } }}
          request= {async ({ keyWords }) => {
            var res=[];
            res=navData({name:keyWords?keyWords:current?.nav?.name});
            return res;
          }}
          colProps={{ md: 8, xl: 8}} labelCol={{span: 4}} wrapperCol={{span: 20}}
        />
        <ProFormText
          name="keywords"
          label="关键词"
          colProps={{ md: 16, xl: 16}} labelCol={{span: 3}} wrapperCol={{span: 19}}
        />
        <ProFormSwitch name="status" label="状态" colProps={{ md: 4, xl: 4}} labelCol={{span: 8}} wrapperCol={{span: 4}}/>
        <ProFormText
          name="description"
          label="描述"
          colProps={{ md: 16, xl: 16}} labelCol={{span: 3}} wrapperCol={{span: 19}}
        />
        <ProFormText name="link" label="链接" colProps={{ md: 8, xl: 8}} labelCol={{span: 4}} wrapperCol={{span: 20}}/>

        <ProFormSelect
          label="Banner"
          name="banner"
          fieldProps={{
            mode: 'multiple', //多选
            autoClearSearchValue:true,//选中后清空搜索框
            onChange:(value: any)=>{
               return value ;//必须要return一个值出去 表单项才会展示值在输入框上
            },
            showSearch: true,
            filterOption:() =>{ return true },
          }}
          request={async ({ keyWords }) => {
            try {
              const options = await bannerData({name:keyWords});
              return options.map((option) => ({
                label: option.title,
                value: option.id,
                key: option.id,
              }));
            } catch (error) {
              console.error('Error fetching banner options:', error);
              return [];
            }
          }}



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

