"use client";

interface FilterBarProps {
  search: string;
  status: string;
  priority: string;
  sort: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

export default function FilterBar({
  search,
  status,
  priority,
  sort,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className="card p-4 flex flex-wrap gap-4 items-end">
      <div className="flex-1 min-w-45">
        <label className="block text-xs font-medium text-muted mb-1">
          Search
        </label>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search issues..."
          className="input-field"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-muted mb-1">
          Status
        </label>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="input-field min-w-32.5"
        >
          <option value="">All</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-muted mb-1">
          Priority
        </label>
        <select
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="input-field min-w-32.5"
        >
          <option value="">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-muted mb-1">
          Sort
        </label>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="input-field min-w-32.5"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
    </div>
  );
}
