export type ArticleItem = {
      id: number;
      title: string;
      nav_id: number;
      keywords: string;
      description: string;
      litpic: string;
      body: string;
      flag_s: number;
      flag_c: number;
      views: number;
    };

export type ArticleItemList = {
      data?: ArticleItem[];
      total?: number;
      success?: boolean;
    };