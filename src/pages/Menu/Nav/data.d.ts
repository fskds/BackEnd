export type NavItem = {
  id: number;
  name: string;
  pid: number;
  url: string;
  sort: number;
  status: string;
};

export type NavItemList = {
  data?: NavItem[];
  total?: number;
  current: number;
  success?: boolean;
};