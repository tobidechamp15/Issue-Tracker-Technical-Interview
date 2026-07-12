import { AlertCircle, Clock, CheckCircle2 } from "lucide-react";

const config: Record<
  string,
  { className: string; icon: typeof AlertCircle; label: string }
> = {
  open: {
    className: "badge-open",
    icon: AlertCircle,
    label: "Open",
  },
  in_progress: {
    className: "badge-progress",
    icon: Clock,
    label: "In Progress",
  },
  closed: {
    className: "badge-closed",
    icon: CheckCircle2,
    label: "Done",
  },
};

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const c = config[status] || config.open;
  const Icon = c.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${c.className}`}
    >
      <Icon className="h-3 w-3" />
      {c.label}
    </span>
  );
}
