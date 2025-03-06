export type SectionListItem = {
  id: number;
  title: string;
  article_id: number;
  order_id: number;
  status: string;
  paragraph: string;
  phonetic: string;
  translation: string;
};
export type SectionList = {
  data?: ArticleSectionListItem[];
  total?: number;
  success?: boolean;
};