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
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-20 mb-3" />
            <div className="h-8 bg-gray-200 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  const cards: { label: string; value: number; color: string }[] = [
    {
      label: "Total Issues",
      value: metrics?.total ?? 0,
      color: "text-gray-900",
    },
    { label: "Open", value: metrics?.open ?? 0, color: "text-blue-600" },
    {
      label: "In Progress",
      value: metrics?.inProgress ?? 0,
      color: "text-amber-600",
    },
    { label: "Closed", value: metrics?.closed ?? 0, color: "text-green-600" },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <p className="text-sm text-gray-500 mb-1">{card.label}</p>
            <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>
      {metrics && metrics.overdue > 0 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-700 font-medium">
            ⚠️ {metrics.overdue} overdue{" "}
            {metrics.overdue === 1 ? "issue" : "issues"}
          </p>
        </div>
      )}
    </div>
  );
}
