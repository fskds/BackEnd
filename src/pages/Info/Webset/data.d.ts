export type InfoItem = {
      id: number;
      name: string;
      status: string;
    };

export type InfoItemList = {
      data?: InfoItem[];
      total?: number;
      success?: boolean;
    };