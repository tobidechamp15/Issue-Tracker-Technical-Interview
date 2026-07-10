type BadgeVariant = "status" | "priority";

const statusColors: Record<string, string> = {
  open: "bg-green-100 text-green-800 border-green-200",
  in_progress: "bg-yellow-100 text-yellow-800 border-yellow-200",
  closed: "bg-gray-100 text-gray-600 border-gray-200",
  overdue: "bg-red-100 text-red-800 border-red-200",
};

const priorityColors: Record<string, string> = {
  low: "bg-blue-100 text-blue-800 border-blue-200",
  medium: "bg-orange-100 text-orange-800 border-orange-200",
  high: "bg-red-100 text-red-800 border-red-200",
};

interface BadgeProps {
  variant: BadgeVariant;
  value: string;
}

export function statusColor(value: string): string {
  return statusColors[value] || "bg-gray-100 text-gray-600 border-gray-200";
}

export function priorityColor(value: string): string {
  return priorityColors[value] || "bg-gray-100 text-gray-600 border-gray-200";
}

export function formatStatus(value: string): string {
  return value.replace(/_/g, " ");
}

export default function Badge({ variant, value }: BadgeProps) {
  const colors =
    variant === "status" ? statusColors[value] : priorityColors[value];

  return (
    <span
      className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium border ${colors || "bg-gray-100 text-gray-600 border-gray-200"}`}
    >
      {variant === "status" ? formatStatus(value) : value}
    </span>
  );
}
