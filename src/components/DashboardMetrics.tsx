import { type DashboardMetrics as Metrics } from "@/services/issue.service";

interface Props {
  metrics: Metrics | null;
  loading?: boolean;
}

export default function DashboardMetrics({ metrics, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-5 animate-pulse">
            <div className="h-4 bg-surface-tertiary rounded w-16 mb-3" />
            <div className="h-8 bg-surface-tertiary rounded w-12" />
          </div>
        ))}
      </div>
    );
  }

  const cards: { label: string; value: number; color: string }[] = [
    {
      label: "Total Issues",
      value: metrics?.total ?? 0,
      color: "text-default",
    },
    {
      label: "Open",
      value: metrics?.open ?? 0,
      color: "text-emerald-700",
    },
    {
      label: "In Progress",
      value: metrics?.inProgress ?? 0,
      color: "text-amber-700",
    },
    {
      label: "Closed",
      value: metrics?.closed ?? 0,
      color: "text-muted",
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="card p-5">
            <p className="text-sm text-muted mb-1">{card.label}</p>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>
      {metrics && metrics.overdue > 0 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 font-medium">
            {metrics.overdue} overdue{" "}
            {metrics.overdue === 1 ? "issue" : "issues"} &mdash; action needed
          </p>
        </div>
      )}
    </div>
  );
}
