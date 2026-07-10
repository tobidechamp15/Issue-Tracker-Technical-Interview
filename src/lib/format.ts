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
