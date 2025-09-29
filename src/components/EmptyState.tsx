import { Code, Plus } from "lucide-react";

interface EmptyStateProps {
  onCreateNew: () => void;
  hasFilters: boolean;
  buttonText?: string;
}

const STYLES = {
  wrapper: "text-center py-16 flex flex-col items-center justify-center",
  iconWrapper: {
    base: "p-4 rounded-full w-20 h-20 flex items-center justify-center mb-6",
    filtered: "bg-gray-100 dark:bg-gray-800",
    empty: "bg-blue-100 dark:bg-blue-900",
  },
  icon: {
    base: "w-10 h-10",
    filtered: "text-gray-400",
    empty: "text-blue-600 dark:text-blue-400",
  },
  title: "text-lg font-semibold text-gray-900 dark:text-white mb-2",
  description: "text-gray-600 dark:text-gray-400 max-w-md",
  button: "inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
} as const;

const MESSAGES = {
  filtered: {
    title: "No snippets found",
    description: "No snippets match your current search criteria. Try adjusting your filters or search terms.",
  },
  empty: {
    title: "Welcome to Snippet Manager",
    description: "Get started by creating your first code snippet. Organize, search, and manage all your code snippets in one place.",
  },
} as const;

export function EmptyState({ onCreateNew, hasFilters, buttonText = "Create Your First Snippet" }: EmptyStateProps) {
  const config = hasFilters ? MESSAGES.filtered : MESSAGES.empty;
  const iconWrapperClass = `${STYLES.iconWrapper.base} ${hasFilters ? STYLES.iconWrapper.filtered : STYLES.iconWrapper.empty}`;
  const iconClass = `${STYLES.icon.base} ${hasFilters ? STYLES.icon.filtered : STYLES.icon.empty}`;

  return (
    <section className={STYLES.wrapper} role="region" aria-label="Empty state">
      <div className={iconWrapperClass}>
        <Code className={iconClass} aria-hidden="true" />
      </div>

      <h3 className={STYLES.title}>{config.title}</h3>
      <p className={STYLES.description}>{config.description}</p>

      {!hasFilters && (
        <button
          onClick={onCreateNew}
          className={STYLES.button}
          aria-label={buttonText}
        >
          <Plus className="w-5 h-5" aria-hidden="true" />
          <span>{buttonText}</span>
        </button>
      )}
    </section>
  );
}
