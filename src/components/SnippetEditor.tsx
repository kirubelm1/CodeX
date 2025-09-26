import { useState, useEffect } from 'react';
import { Save, X, Plus, Tag as TagIcon } from 'lucide-react';
import { Snippet, SnippetVersion } from '../types';
import { LANGUAGES } from '../constants/languages';
import { SyntaxHighlighter } from './SyntaxHighlighter';

interface SnippetEditorProps {
  snippet?: Snippet;
  onSave: (snippet: Omit<Snippet, 'id' | 'createdAt' | 'updatedAt' | 'versions'>) => void;
  onCancel: () => void;
  existingTags: string[];
}

export function SnippetEditor({ snippet, onSave, onCancel, existingTags }: SnippetEditorProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
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

  const handleAddTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
    }
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
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
  };

  const suggestedTags = existingTags
    .filter(tag => 
      tag.toLowerCase().includes(newTag.toLowerCase()) && 
      !tags.includes(tag) &&
      tag !== newTag.toLowerCase()
    )
    .slice(0, 5);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {snippet ? 'Edit Snippet' : 'Create New Snippet'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Title and Language */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                placeholder="Enter snippet title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors resize-none"
              placeholder="Optional description"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags
            </label>
            <div className="space-y-3">
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      <TagIcon className="w-3 h-3" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="relative">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag(newTag);
                    }
                  }}
                  className="w-full px-3 py-2 pr-10 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                  placeholder="Add a tag"
                />
                <button
                  type="button"
                  onClick={() => handleAddTag(newTag)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  <Plus className="w-4 h-4 text-gray-500" />
                </button>
                {suggestedTags.length > 0 && newTag && (
                  <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg mt-1 shadow-lg z-10">
                    {suggestedTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleAddTag(tag)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Code Editor and Preview Toggle */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Code *
              </label>
              <div className="flex rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    !showPreview
                      ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    showPreview
                      ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Preview
                </button>
              </div>
            </div>
            {showPreview ? (
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                <SyntaxHighlighter code={code || '// Your code will appear here'} language={language} />
              </div>
            ) : (
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={12}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 font-mono text-sm transition-colors"
                placeholder="Enter your code here..."
                required
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
              className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
            />
            <label htmlFor="favorite" className="text-sm text-gray-700 dark:text-gray-300">
              Mark as favorite
            </label>
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !code.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {snippet ? 'Update' : 'Create'} Snippet
          </button>
        </div>
      </div>
    </div>
  );
}