import Link from "next/link";

interface IssueCardProps {
  issue: {
    _id: string;
    title: string;
    status: string;
    priority: string;
    assignee: string;
    dueDate?: string | null;
    createdAt: string;
  };
}

const statusColors: Record<string, string> = {
  open: "bg-blue-100 text-blue-700",
  in_progress: "bg-amber-100 text-amber-700",
  closed: "bg-green-100 text-green-700",
};

const priorityColors: Record<string, string> = {
  low: "bg-gray-100 text-gray-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
};

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isOverdue(dueDate?: string | null, status?: string): boolean {
  if (!dueDate || status === "closed") return false;
  return new Date(dueDate) < new Date();
}

export default function IssueCard({ issue }: IssueCardProps) {
  const overdue = isOverdue(issue.dueDate, issue.status);

  return (
    <Link
      href={`/issues/${issue._id}`}
      className="block bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 truncate">
            {issue.title}
          </h3>
          <div className="flex flex-wrap gap-2 mt-2">
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[issue.status] || "bg-gray-100"}`}
            >
              {issue.status.replace("_", " ")}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[issue.priority] || "bg-gray-100"}`}
            >
              {issue.priority}
            </span>
            {overdue && (
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-700">
                Overdue
              </span>
            )}
          </div>
        </div>
        <div className="text-right text-xs text-gray-500 shrink-0">
          {issue.assignee && <p className="mb-1">👤 {issue.assignee}</p>}
          <p>Due: {formatDate(issue.dueDate)}</p>
          <p className="mt-1">{formatDate(issue.createdAt)}</p>
        </div>
      </div>
    </Link>
  );
}
