export type ColumnItem = {
  id: number;
  name: string;
  pid: number;
  url: string;
  sort: number;
  status: string;
};

export type ColumnItemList = {
  data?: ColumnItem[];
  total?: number;
  success?: boolean;
};