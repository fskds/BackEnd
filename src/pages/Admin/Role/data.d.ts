export type RoleItem = {
    id: number;
    name: string;
    display_name: string;
};
    
export type RoleItemList = {
    data?: RoleItem[];
    total?: number;
    success?: boolean;
};

export type RolePermissionList = {
  apermission: any[];
  dpermission: any[];
  success?: boolean;
};
export type PermissionRoleData = {
  data?: any[];
};