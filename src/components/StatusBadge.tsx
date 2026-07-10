import { AlertCircle, Clock, CheckCircle2 } from "lucide-react";

const config: Record<
  string,
  { bg: string; text: string; icon: typeof AlertCircle; label: string }
> = {
  open: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    icon: AlertCircle,
    label: "Open",
  },
  in_progress: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    icon: Clock,
    label: "In Progress",
  },
  closed: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
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
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${c.bg} ${c.text}`}
    >
      <Icon className="h-3 w-3" />
      {c.label}
    </span>
  );
}
