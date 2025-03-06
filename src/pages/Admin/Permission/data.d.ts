export type PermissionItem = {
  id: number;
  name: string;
  display_name: string;
  route: string;
  icon: string;
  pid: number;
  sort: number;
  children?: DynastyListItem[];
};

export type PermissionItemList = {
  data: PermissionItem[];
  success?: boolean;
};
