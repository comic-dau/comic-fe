export interface Chapter {
    id: number;
    number: number;
    title: string;
    views: number;
    src_image: string[];
    comic_info: {
      id: number;
      name: string;
    };
  }
  