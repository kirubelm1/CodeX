import { useState, useEffect, useCallback } from 'react';
import { Save, X, Plus, Tag as TagIcon } from 'lucide-react';
import { Snippet } from '../types';
import { LANGUAGES } from '../constants/languages';
import { SyntaxHighlighter } from './SyntaxHighlighter';

interface SnippetEditorProps {
  snippet?: Snippet;
  onSave: (snippet: Omit<Snippet, 'id' | 'createdAt' | 'updatedAt' | 'versions'>) => void;
  onCancel: () => void;
  existingTags: string[];
}

export function SnippetEditor({ snippet, onSave, onCancel, existingTags }: SnippetEditorProps) {
  const [title, setTitle] = useState(snippet?.title || '');
  const [description, setDescription] = useState(snippet?.description || '');
  const [code, setCode] = useState(snippet?.code || '');
  const [language, setLanguage] = useState(snippet?.language || 'javascript');
  const [tags, setTags] = useState<string[]>(snippet?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [isFavorite, setIsFavorite] = useState(snippet?.isFavorite || false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (snippet) {
      setTitle(snippet.title);
      setDescription(snippet.description);
      setCode(snippet.code);
      setLanguage(snippet.language);
      setTags(snippet.tags);
      setIsFavorite(snippet.isFavorite);
    }
  }, [snippet]);

  const handleAddTag = useCallback((tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags((prev) => [...prev, trimmedTag]);
      setNewTag('');
    }
  }, [tags]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) return;
    onSave({
      title: title.trim(),
      description: description.trim(),
      code: code.trim(),
      language,
      tags,
      isFavorite,
    });
  }, [title, description, code, language, tags, isFavorite, onSave]);

  const suggestedTags = existingTags
    .filter(
      (tag) =>
        tag.toLowerCase().includes(newTag.toLowerCase()) &&
        !tags.includes(tag) &&
        tag !== newTag.toLowerCase()
    )
    .slice(0, 5);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
            {snippet ? 'Edit Snippet' : 'Create New Snippet'}
          </h2>
          <button
            onClick={onCancel}
            aria-label="Close editor"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" aria-hidden="true" />
          </button>
        </header>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Title and Language */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors text-gray-900 dark:text-white"
                placeholder="Enter snippet title"
                required
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors text-gray-900 dark:text-white"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors text-gray-900 dark:text-white resize-none"
              placeholder="Optional description"
            />
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tag-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags
            </label>
            <div className="space-y-3">
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-3 py-1.5 rounded-full text-sm flex items-center gap-2"
                    >
                      <TagIcon className="w-3.5 h-3.5" aria-hidden="true" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        aria-label={`Remove ${tag} tag`}
                        className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="relative">
                <input
                  id="tag-input"
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag(newTag);
                    }
                  }}
                  className="w-full px-4 py-2 pr-12 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors text-gray-900 dark:text-white"
                  placeholder="Add a tag"
                />
                <button
                  type="button"
                  onClick={() => handleAddTag(newTag)}
                  aria-label="Add tag"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <Plus className="w-5 h-5 text-gray-500" aria-hidden="true" />
                </button>
                {suggestedTags.length > 0 && newTag && (
                  <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg mt-1 shadow-lg z-10 max-h-48 overflow-y-auto">
                    {suggestedTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleAddTag(tag)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm first:rounded-t-lg last:rounded-b-lg"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Code Editor and Preview */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Code <span className="text-red-500">*</span>
              </label>
              <div className="flex rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    !showPreview
                      ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  aria-pressed={!showPreview}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    showPreview
                      ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  aria-pressed={showPreview}
                >
                  Preview
                </button>
              </div>
            </div>
            {showPreview ? (
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                <SyntaxHighlighter
                  code={code || '// Your code will appear here'}
                  language={language}
                />
              </div>
            ) : (
              <textarea
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={12}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 font-mono text-sm transition-colors text-gray-900 dark:text-white"
                placeholder="Enter your code here..."
                required
                aria-required="true"
              />
            )}
          </div>

          {/* Favorite Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="favorite"
              checked={isFavorite}
              onChange={(e) => setIsFavorite(e.target.checked)}
              className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500 dark:focus:ring-offset-gray-800"
            />
            <label htmlFor="favorite" className="text-sm text-gray-700 dark:text-gray-300">
              Mark as favorite
            </label>
          </div>
        </form>

        {/* Footer */}
        <footer className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-3 bg-gray-50 dark:bg-gray-900">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
            aria-label="Cancel editing"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!title.trim() || !code.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium flex items-center gap-2"
            aria-label={snippet ? 'Update snippet' : 'Create snippet'}
          >
            <Save className="w-4 h-4" aria-hidden="true" />
            {snippet ? 'Update' : 'Create'} Snippet
          </button>
        </footer>
      </div>
    </div>
  );
}
