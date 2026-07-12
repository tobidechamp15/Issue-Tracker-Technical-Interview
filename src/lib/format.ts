/**
 * Format a date string to "Jun 10" or "Jun 10, 2026" if the year differs from current.
 */
export function formatDate(
  dateStr?: string | null,
  options?: { includeYear?: boolean },
): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  const now = new Date();
  const includeYear =
    options?.includeYear ?? date.getFullYear() !== now.getFullYear();

  const month = date.toLocaleDateString("en-US", { month: "short" });
  const day = date.toLocaleDateString("en-US", { day: "numeric" });

  if (includeYear) {
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  }
  return `${month} ${day}`;
}

export function isOverdue(dueDate?: string | null, status?: string): boolean {
  if (!dueDate || status === "closed") return false;
  return new Date(dueDate) < new Date();
}

export function formatRelativeTime(dateStr?: string | null): string {
  if (!dateStr) return "—";
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return formatDate(dateStr);
}

export function generateIssueId(index: number): string {
  return `ISS-${String(index + 100).padStart(3, "0")}`;
}
