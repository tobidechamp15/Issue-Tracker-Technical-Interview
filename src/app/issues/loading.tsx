export default function IssuesLoading() {
  return (
    <div className="max-w-360 mx-auto px-4 py-8 animate-pulse">
      <div className="h-8 bg-surface-tertiary rounded w-32 mb-6" />
      <div className="card p-4 mb-6">
        <div className="flex gap-4">
          <div className="h-10 bg-surface-tertiary rounded flex-1" />
          <div className="h-10 bg-surface-tertiary rounded w-32" />
          <div className="h-10 bg-surface-tertiary rounded w-32" />
          <div className="h-10 bg-surface-tertiary rounded w-28" />
        </div>
      </div>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card p-5">
            <div className="h-5 bg-surface-tertiary rounded w-3/4 mb-3" />
            <div className="flex gap-2">
              <div className="h-4 bg-surface-tertiary rounded w-16" />
              <div className="h-4 bg-surface-tertiary rounded w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
