import {
  Heart,
  Copy,
  Pencil as Edit,
  Trash2,
  Clock,
  Tag,
} from "lucide-react";
import { Snippet } from "../types";
import { LANGUAGES } from "../constants/languages";
import { SyntaxHighlighter } from "./SyntaxHighlighter";

interface SnippetCardProps {
  snippet: Snippet;
  onEdit: (snippet: Snippet) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onCopy: (code: string) => void;
}

export function SnippetCard({
  snippet,
  onEdit,
  onDelete,
  onToggleFavorite,
  onCopy,
}: SnippetCardProps) {
  const language = LANGUAGES.find((lang) => lang.id === snippet.language);

  return (
    <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Header */}
      <header className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {snippet.title}
            </h3>
            {snippet.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                {snippet.description}
              </p>
            )}
          </div>

          {/* Favorite button */}
          <button
            onClick={() => onToggleFavorite(snippet.id)}
            aria-pressed={snippet.isFavorite}
            className={`ml-3 p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
              snippet.isFavorite
                ? "text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20"
                : "text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            title={
              snippet.isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Heart
              className={`w-5 h-5 ${snippet.isFavorite ? "fill-current" : ""}`}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Language and Tags */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {language && (
            <span
              className="px-2 py-1 text-xs font-medium rounded-full text-white"
              style={{ backgroundColor: language.color }}
            >
              {language.name}
            </span>
          )}
          {snippet.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full flex items-center gap-1"
            >
              <Tag className="w-3 h-3" aria-hidden="true" />
              {tag}
            </span>
          ))}
          {snippet.tags.length > 3 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              +{snippet.tags.length - 3} more
            </span>
          )}
        </div>
      </header>

      {/* Code Preview */}
      <div className="px-6 pb-4">
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
          <SyntaxHighlighter
            code={snippet.code}
            language={snippet.language}
            maxLines={8}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4" aria-hidden="true" />
            <span>
              Updated {new Date(snippet.updatedAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onCopy(snippet.code)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              onClick={() => onEdit(snippet)}
              className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              title="Edit snippet"
            >
              <Edit className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              onClick={() => onDelete(snippet.id)}
              className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              title="Delete snippet"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </footer>
    </article>
  );
}
