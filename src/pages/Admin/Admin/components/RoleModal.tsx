import React, { useEffect, useState } from 'react';
import {
  ModalForm,
  ProFormCheckbox,
} from '@ant-design/pro-components';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import type { AdminItem, RoleAdminData, AdminRoleList  } from './data.d';
import { adminRole } from '../service';

type RoleModalProps = {
  visible: boolean;
  current: Partial<AdminItem> | undefined;
  onDone: () => void;
  onSubmit: (values: RoleAdminData) => void;
};

const RoleModal: React.FC<RoleModalProps> = (props) => {
  const { visible, current, userId, onDone, onSubmit } = props;
//  const [userId, setUserId] = useState<number>(0);
  const [allRoles, setAllRoles] = useState([]);
  const [defRoles, setDefRoles] = useState([]);
  const [ready, setReady] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const handleAdminRole = async (currentRow?: AdminItem) => {
    if (!currentRow) return true;
    try {
      const res = await adminRole({
        id : currentRow.id,
      });
      if(res.success){
        setAllRoles(res.arole);
        setDefRoles(res.drole);
      }
      setIsLoading(false);
      return true;
    } catch (error) {
      return false;
    }
  };
  useEffect(() => {
    setIsLoading(true);
    handleAdminRole(current);
  }, [visible]);
  return (
    <ModalForm<AdminRoleList>
      title={(current ? current.username : "") +' 角色设置'}
      visible={visible}
      onFinish={async (values) => {
        onSubmit(values);
      }}
      modalProps={{
        onCancel: () => onDone(),
        destroyOnClose: true,
      }}
      destroyOnClose={true}
    >
    {isLoading ? (
    <div>Loading...</div>
    ):(
      <ProFormCheckbox.Group
        name="roles"
        initialValue={defRoles}
        layout="horizontal"
        options={allRoles}
        
      />
    )}
    </ModalForm>
  );
};

export default RoleModal;
  
  

