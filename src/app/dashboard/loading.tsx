export default function DashboardLoading() {
  return (
    <div className="max-w-360 mx-auto px-4 py-8 animate-pulse">
      <div className="h-8 bg-surface-tertiary rounded w-40 mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-5">
            <div className="h-4 bg-surface-tertiary rounded w-20 mb-3" />
            <div className="h-8 bg-surface-tertiary rounded w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
