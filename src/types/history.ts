export interface HistoryItem {
  id: number;
  comic_info: {
    id: number;
    name: string;
  };
  chapter_info: {
    id: number;
    number: number;
    title: string;
  };
  content: string;
  created_at: string;
  user: number;
}
