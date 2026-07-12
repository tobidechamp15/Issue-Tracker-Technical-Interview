import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  iconBg: string;
  trend?: { direction: "up" | "down"; percentage: number };
}

export default function MetricCard({
  label,
  value,
  icon: Icon,
  iconBg,
  trend,
}: MetricCardProps) {
  return (
    <div className="card p-5 shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted mb-1">{label}</p>
          <p className="text-2xl font-bold text-default">{value}</p>
        </div>
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-1 mt-3">
          {trend.direction === "up" ? (
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-red-500 dark:text-red-400" />
          )}
          <span
            className={`text-xs font-medium ${trend.direction === "up" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
          >
            {trend.percentage}%
          </span>
          <span className="text-xs text-subtle ml-1">vs last month</span>
        </div>
      )}
    </div>
  );
}
