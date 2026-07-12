import { AlertTriangle, ArrowUp, Minus } from "lucide-react";

const config: Record<
  string,
  { icon: typeof AlertTriangle; text: string; label: string }
> = {
  high: { icon: AlertTriangle, text: "text-red-600", label: "High" },
  medium: { icon: ArrowUp, text: "text-amber-600", label: "Medium" },
  low: { icon: Minus, text: "text-gray-400", label: "Low" },
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
      className={`inline-flex items-center gap-1 text-xs font-medium ${c.text}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {c.label}
    </span>
  );
}
