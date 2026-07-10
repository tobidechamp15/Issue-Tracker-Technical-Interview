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
          <div
            key={i}
            className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-16 mb-3" />
            <div className="h-8 bg-gray-200 rounded w-12" />
          </div>
        ))}
      </div>
    );
  }

  const cards: { label: string; value: number; color: string; icon: string }[] =
    [
      {
        label: "Total Issues",
        value: metrics?.total ?? 0,
        color: "text-gray-900",
        icon: "📋",
      },
      {
        label: "Open",
        value: metrics?.open ?? 0,
        color: "text-green-700",
        icon: "🟢",
      },
      {
        label: "In Progress",
        value: metrics?.inProgress ?? 0,
        color: "text-yellow-700",
        icon: "🟡",
      },
      {
        label: "Closed",
        value: metrics?.closed ?? 0,
        color: "text-gray-500",
        icon: "✅",
      },
    ];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{card.icon}</span>
              <p className="text-sm text-gray-500">{card.label}</p>
            </div>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>
      {metrics && metrics.overdue > 0 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 font-medium">
            ⚠️ {metrics.overdue} overdue{" "}
            {metrics.overdue === 1 ? "issue" : "issues"} — action needed
          </p>
        </div>
      )}
    </div>
  );
}
