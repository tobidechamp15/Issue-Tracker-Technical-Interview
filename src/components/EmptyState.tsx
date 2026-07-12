interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
}

export default function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-4">
      <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-surface-tertiary flex items-center justify-center">
        <svg
          className="w-6 h-6 text-subtle"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 11.625l2.25-2.25M12 11.625l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
          />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-default mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted mb-4 max-w-sm mx-auto">
          {description}
        </p>
      )}
      {action && (
        <a href={action.href} className="btn-primary">
          {action.label}
        </a>
      )}
    </div>
  );
}
