
export interface ImageItem {
  id: string;
  title: string;
  category: string;
  tags: string[];
  description: string;
  source: string;
  url: string;
  downloads: number;
  createdAt: number;
}

export interface AppState {
  images: ImageItem[];
  isAdmin: boolean;
}

export enum Category {
  NATURE = 'Nature',
  ARCHITECTURE = 'Architecture',
  TECHNOLOGY = 'Technology',
  PEOPLE = 'People',
  ABSTRACT = 'Abstract',
  ANIMALS = 'Animals'
}
