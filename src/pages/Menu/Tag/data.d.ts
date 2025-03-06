export type TagListItem = {
      id: number;
      name: string;
      status: string;
    };

export type TagList = {
      data?: TagListItem[];
      total?: number;
      success?: boolean;
    };