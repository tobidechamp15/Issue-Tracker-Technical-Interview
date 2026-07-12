import Link from "next/link";
import Badge from "@/components/Badge";
import { formatDate, isOverdue } from "@/lib/format";

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

export default function IssueCard({ issue }: IssueCardProps) {
  const overdue = isOverdue(issue.dueDate, issue.status);

  return (
    <Link href={`/issues/${issue._id}`} className="card-hover block p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-default truncate">
            {issue.title}
          </h3>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant="status" value={issue.status} />
            <Badge variant="priority" value={issue.priority} />
            {overdue && <Badge variant="status" value="overdue" />}
          </div>
        </div>
        <div className="text-right shrink-0 space-y-1">
          {issue.assignee && (
            <p className="text-xs text-muted">{issue.assignee}</p>
          )}
          <p className="text-xs text-muted">Due {formatDate(issue.dueDate)}</p>
          <p className="text-xs text-muted">{formatDate(issue.createdAt)}</p>
        </div>
      </div>
    </Link>
  );
}
