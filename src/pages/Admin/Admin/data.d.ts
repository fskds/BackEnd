export type AdminItem = {
  id: number;
  username: string;
  phone: string;
  name: string;
  email: string;
  role：any[];
  password?: string;
};
export type AdminItemList = {
    data: AdminItem[];
    total: number;
    current: number;
    success?: boolean;
};
export type AdminRoleList = {
  arole: any[];
  drole: any[];
  success?: boolean;
};
export type RoleAdminData = {
  data?: any[];
};

export type AdminPermissionList = {
  apermission: any[];
  dpermission: any[];
  success?: boolean;
};
export type PermissionAdminData = {
  data?: any[];
};