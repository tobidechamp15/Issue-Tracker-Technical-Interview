type BadgeVariant = "status" | "priority";

const statusColors: Record<string, string> = {
  open: "badge-open",
  in_progress: "badge-progress",
  closed: "badge-closed",
};

const priorityColors: Record<string, string> = {
  low: "badge-closed priority-low",
  medium: "badge-progress priority-medium",
  high: "badge-open priority-high",
};

interface BadgeProps {
  variant: BadgeVariant;
  value: string;
}

export function statusColor(value: string): string {
  return statusColors[value] || "badge-closed";
}

export function priorityColor(value: string): string {
  return priorityColors[value] || "badge-closed";
}

export function formatStatus(value: string): string {
  return value.replace(/_/g, " ");
}

export default function Badge({ variant, value }: BadgeProps) {
  const colors =
    variant === "status" ? statusColors[value] : priorityColors[value];

  return (
    <span
      className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium border ${colors || "badge-closed"}`}
    >
      {variant === "status" ? formatStatus(value) : value}
    </span>
  );
}
