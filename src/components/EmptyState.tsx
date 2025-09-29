import { Code, Plus } from "lucide-react";

interface EmptyStateProps {
  onCreateNew: () => void;
  hasFilters: boolean;
}

export function EmptyState({ onCreateNew, hasFilters }: EmptyStateProps) {
  const iconClasses = "w-10 h-10";
  const wrapperClasses =
    "text-center py-16 flex flex-col items-center justify-center";

  if (hasFilters) {
    return (
      <section className={wrapperClasses}>
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-20 h-20 flex items-center justify-center mb-6">
          <Code className={`${iconClasses} text-gray-400`} aria-hidden="true" />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No snippets found
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          No snippets match your current search criteria. Try adjusting your
          filters or search terms.
        </p>
      </section>
    );
  }

  return (
    <section className={wrapperClasses}>
      <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full w-20 h-20 flex items-center justify-center mb-6">
        <Code
          className={`${iconClasses} text-blue-600 dark:text-blue-400`}
          aria-hidden="true"
        />
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Welcome to Snippet Manager
      </h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
        Get started by creating your first code snippet. Organize, search, and
        manage all your code snippets in one place.
      </p>

      <button
        onClick={onCreateNew}
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      >
        <Plus className="w-5 h-5" aria-hidden="true" />
        <span>Create Your First Snippet</span>
      </button>
    </section>
  );
}
