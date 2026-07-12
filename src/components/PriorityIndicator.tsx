import { AlertTriangle, ArrowUp, Minus } from "lucide-react";

const config: Record<
  string,
  { icon: typeof AlertTriangle; className: string; label: string }
> = {
  high: { icon: AlertTriangle, className: "priority-high", label: "High" },
  medium: { icon: ArrowUp, className: "priority-medium", label: "Medium" },
  low: { icon: Minus, className: "priority-low", label: "Low" },
};

interface PriorityIndicatorProps {
  priority: string;
}

export default function PriorityIndicator({
  priority,
}: PriorityIndicatorProps) {
  const c = config[priority] || config.medium;
  const Icon = c.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${c.className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {c.label}
    </span>
  );
}
