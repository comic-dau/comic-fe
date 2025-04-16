export interface Author {
  id: number;
  name: string;
  des?: string;
  image_avatar?: string;
}

export interface Comic {
  id: number;
  last_chapter: number | null;
  author_info: Author;
  name: string;
  genres: string;
  introduction: string;
  image: string;
  preview_image: string;
  background_image?: string;
  views: number;
  total_chapter: number;
  like: number;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface Chapter {
  id: number;
  comic_info: {
    id: number;
    name: string;
  };
  number: number;
  title: string;
  views: number;
  src_image: string;
  updated_at: string;
  created_at: string;
}