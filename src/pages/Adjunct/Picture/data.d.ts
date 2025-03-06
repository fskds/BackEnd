export type PictureListItem = {
      id: number;
      title: string;
      name: string;
      image: string;
      size: number;
    };

export type PictureList = {
      data?: PictureListItem[];
      total?: number;
      success?: boolean;
    };



