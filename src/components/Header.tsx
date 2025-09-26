import { Code, Plus, Download, Upload, Search } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  onCreateNew: () => void;
  onExport: () => void;
  onImport: () => void;
  snippetCount: number;
}

export function Header({ onCreateNew, onExport, onImport, snippetCount }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Code className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Snippet Manager
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {snippetCount} snippet{snippetCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onImport}
              className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
              title="Import snippets"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Import</span>
            </button>
            <button
              onClick={onExport}
              className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
              title="Export snippets"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <ThemeToggle />
            <button
              onClick={onCreateNew}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Snippet</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}