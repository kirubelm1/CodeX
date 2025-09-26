import { Snippet, SnippetVersion } from '../types';

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const createSnippetVersion = (code: string, description?: string): SnippetVersion => ({
  id: generateId(),
  code,
  timestamp: new Date(),
  description,
});

export const exportSnippets = (snippets: Snippet[]): string => {
  return JSON.stringify(snippets, null, 2);
};

export const importSnippets = (jsonString: string): Snippet[] => {
  try {
    const data = JSON.parse(jsonString);
    return Array.isArray(data) ? data.map(snippet => ({
      ...snippet,
      createdAt: new Date(snippet.createdAt),
      updatedAt: new Date(snippet.updatedAt),
      versions: snippet.versions?.map((v: any) => ({
        ...v,
        timestamp: new Date(v.timestamp),
      })) || [],
    })) : [];
  } catch (error) {
    console.error('Failed to import snippets:', error);
    return [];
  }
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};