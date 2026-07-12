type BadgeVariant = "status" | "priority";

const statusColors: Record<string, string> = {
  open: "bg-emerald-50 text-emerald-700 border-emerald-200",
  in_progress: "bg-amber-50 text-amber-700 border-amber-200",
  closed: "bg-gray-100 text-gray-500 border-gray-200",
  overdue: "bg-red-50 text-red-700 border-red-200",
};

const priorityColors: Record<string, string> = {
  low: "bg-gray-100 text-gray-500 border-gray-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  high: "bg-red-50 text-red-700 border-red-200",
};

interface BadgeProps {
  variant: BadgeVariant;
  value: string;
}

export function statusColor(value: string): string {
  return statusColors[value] || "bg-gray-100 text-gray-500 border-gray-200";
}

export function priorityColor(value: string): string {
  return priorityColors[value] || "bg-gray-100 text-gray-500 border-gray-200";
}

export function formatStatus(value: string): string {
  return value.replace(/_/g, " ");
}

export default function Badge({ variant, value }: BadgeProps) {
  const colors =
    variant === "status" ? statusColors[value] : priorityColors[value];

  return (
    <span
      className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium border ${colors || "bg-gray-100 text-gray-500 border-gray-200"}`}
    >
      {variant === "status" ? formatStatus(value) : value}
    </span>
  );
}
