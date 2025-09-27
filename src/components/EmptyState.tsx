import { Code, Plus } from 'lucide-react';

interface EmptyStateProps {
  onCreateNew: () => void;
  hasFilters: boolean;
}

export function EmptyState({ onCreateNew, hasFilters }: EmptyStateProps) {
  if (hasFilters) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <Code className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No snippets found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            No snippets match your current search criteria. Try adjusting your filters or search terms.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <Code className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Welcome to Snippet Manager
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Get started by creating your first code snippet. Organize, search, and manage all your code snippets in one place.
        </p>
        <button
          onClick={onCreateNew}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Your First Snippet
        </button>
      </div>
    </div>
  );
}
