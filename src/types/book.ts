export interface Book {
  id: string;
  title: string;
  author: string;
  isRead: boolean;
}

export interface NewBook {
  title: string;
  author: string;
}

export type BookFilter =
  | 'all'
  | 'read'
  | 'unread';

export interface ApiBook {
  key: string;
  title: string;
  authorName: string;
}

export interface OpenLibraryBook {
  key: string;
  title: string;
  author_name?: string[];
}

export interface OpenLibraryResponse {
  docs: OpenLibraryBook[];
}