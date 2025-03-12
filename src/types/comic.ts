export interface Author {
  id: number;
  name: string;
}

export interface Comic {
  id: number;
  last_chapter: number | null;
  author_info: Author;
  name: string;
  genres: string;
  introduction: string;
  image: string;
  views: number;
  total_chapter: number;
  like: number;
  rating: number;
  created_at: string;
  updated_at: string;
}