import React, { useEffect, useState, useRef } from 'react';
import { Tree, } from 'antd';
import {
  ModalForm,
  ProFormCheckbox,
} from '@ant-design/pro-components';
import { useRequest } from 'umi';
import type { AdminItem, PermissionAdminData  } from './data.d';
import { adminPermission } from '../service';
import type { TreeProps } from 'antd/es/tree';

type PermissionModalProps = {
  visible: boolean;
  current: Partial<AdminItem> | undefined;
  onDone: () => void;
  onSubmit: (values: PermissionAdminData) => void;
};

const PermissionModal: React.FC<PermissionModalProps> = (props) => {
  const { visible, current, userId, onDone, onSubmit } = props;
  const [allPermissions, setAllPermissions] = useState([]);
  const [defPermissions, setDefPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const handleAdminPermission = async (currentRow?: AdminItem) => {
    if (!currentRow) return true;
    try {
      const res = await adminPermission({
        id:currentRow.id,
      });
      if(res.success){
        setAllPermissions(res.apermission);
        setDefPermissions(res.dpermission);
      }
      setIsLoading(false);
      return true;
    } catch (error) {
      return false;
    }
  };
  useEffect(() => {
    setIsLoading(true);
    handleAdminPermission(current);
  }, [visible]);
  const formRef = useRef<ProFormInstance>();

  const onCheck = (checkedKeys, info) => {
    const { checkedNodes,node } = info;
    let updatedKeys = [...checkedKeys.checked];
    // 处理选中和取消选中逻辑
    if (info.checked) {
      const childchecked =(Nodes) =>{
        if(Array.isArray(Nodes.children)){
          Nodes.children.forEach(child => {
            if (!updatedKeys.includes(child.key)) {
              updatedKeys.push(child.key);
              childchecked(child);
            }
          });
        }
      };
      childchecked(node);
      
      const parentchecked =(key) =>{
        const parentKey = getParentKey(key, allPermissions);
        if (!updatedKeys.includes(parentKey) && parentKey > 0) {
          updatedKeys.push(parentKey);
          parentchecked(parentKey);
        }
      };
      parentchecked(node.key);
    } else {
      const childchecked =(Nodes) =>{
        if(Array.isArray(Nodes.children)){
          Nodes.children.forEach(child => {
            const childIndex = updatedKeys.indexOf(child.key);
            if (childIndex !== -1) {
              updatedKeys.splice(childIndex, 1);
              childchecked(child);
            }
          });
        }
      };
      childchecked(node);

      const parentchecked =(key) =>{
        const parentKey = getParentKey(key, allPermissions);
        if(parentKey){
          const parentNode = findInTree(allPermissions, parentKey);
          if (parentNode && parentNode.children) {
            const siblings = parentNode.children;
            const allSiblingsUnchecked = siblings.some(sibling => updatedKeys.includes(sibling.key));
            if (!allSiblingsUnchecked) {
              updatedKeys = updatedKeys.filter(k => k !== parentKey);
              parentchecked(parentKey);
            }
          }
        }
      };
      //parentchecked(node.key);
    }
    setDefPermissions(updatedKeys);
    formRef?.current?.setFieldsValue({
      permissions: updatedKeys,
    });
  };
  function findInTree(tree, key) {
    for (const item of tree) {
      if (item.key === key) {
        return item;
      }
      if (item.children) {
        const result = findInTree(item.children, key);
        if (result) return result;
      }
    }
    return null;
  }
  const getParentKey = (key, treeData) => {
    for (let i = 0; i < treeData.length; i++) {
      const node = treeData[i];
      if (node.children) {
        if (node.children.some(child => child.key === key)) {
          return node.key;
        } else if (getParentKey(key, node.children)) {
          return getParentKey(key, node.children);
        }
      }
    }
    return null;
  };

  return (
    <ModalForm<AdminRoleList>
      title={(current ? current.username : "") +' 权限设置'}
      visible={visible}
      onFinish={async (values) => {
        onSubmit(values);
      }}
      formRef={formRef}
      modalProps={{
        onCancel: () => onDone(),
        destroyOnClose: true,
      }}
    >
    {isLoading ? (
      <div>Loading...</div>
    ): (
      <Tree
        checkable
        checkStrictly
        defaultExpandAll={true}
        checkedKeys={defPermissions}
        onCheck={onCheck}
        treeData={allPermissions}
      />
    )}
      <ProFormCheckbox.Group
        initialValue={defPermissions}
        name="permissions"
        layout="horizontal"
        hidden
      />
    </ModalForm>
  );
};
export default PermissionModal;
  
  

