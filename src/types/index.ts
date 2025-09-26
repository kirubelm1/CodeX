export interface Snippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  versions: SnippetVersion[];
}

export interface SnippetVersion {
  id: string;
  code: string;
  timestamp: Date;
  description?: string;
}

export interface Language {
  id: string;
  name: string;
  extension: string;
  color: string;
}

export interface SearchFilters {
  query: string;
  language: string;
  tags: string[];
  showFavoritesOnly: boolean;
}