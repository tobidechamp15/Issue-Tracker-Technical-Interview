"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Filter, Search, X } from "lucide-react";
import FilterBar from "@/components/FilterBar";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import PriorityIndicator from "@/components/PriorityIndicator";
import Avatar from "@/components/Avatar";
import EmptyState from "@/components/EmptyState";
import { formatRelativeTime, generateIssueId } from "@/lib/format";

interface Issue {
  _id: string;
  title: string;
  status: string;
  priority: string;
  assignee: string;
  createdAt: string;
}

interface ListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const TABS = [
  { key: "", label: "All" },
  { key: "open", label: "Open" },
  { key: "in_progress", label: "In Progress" },
  { key: "closed", label: "Done" },
] as const;

const PRIORITY_OPTIONS = [
  { value: "", label: "All Priorities" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
] as const;

export default function IssuesPage() {
  const router = useRouter();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [meta, setMeta] = useState<ListMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const [priority, setPriority] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Issue[]>([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (activeTab) params.set("status", activeTab);
    if (priority) params.set("priority", priority);
    params.set("sort", sort);
    params.set("page", String(page));
    params.set("limit", "10");

    api
      .get<Issue[]>(`/api/issues?${params.toString()}`)
      .then((res) => {
        setIssues(res.data);
        if (res.meta) setMeta(res.meta as unknown as ListMeta);
      })
      .catch((err) => {
        if (err instanceof Error && err.message.includes("401")) {
          router.push("/login");
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load issues");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [activeTab, priority, sort, page, router]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const params = new URLSearchParams();
        params.set("search", query.trim());
        params.set("limit", "8");
        const res = await api.get<Issue[]>(`/api/issues?${params.toString()}`);
        setSearchResults(res.data);
        setShowDropdown(res.data.length > 0);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowDropdown(false);
  };

  const startItem = meta ? (meta.page - 1) * meta.limit + 1 : 0;
  const endItem = meta ? Math.min(meta.page * meta.limit, meta.total) : 0;

  return (
    <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-default">Issues</h1>
          <p className="text-sm text-muted mt-1">
            Manage and track all project issues.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters((prev) => !prev)}
            className={`btn-secondary gap-2 ${showFilters ? "bg-surface-secondary" : ""}`}
          >
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <Link href="/issues/new" className="btn-primary">
            + New Issue
          </Link>
        </div>
      </div>

      <div ref={searchRef} className="relative mb-6">
        {/* <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-subtle" />
          <input
            type="text"
            placeholder="Search issues by title..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => {
              if (searchResults.length > 0) setShowDropdown(true);
            }}
            className="input-field pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-default transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div> */}

        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-default border border-default rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
            {searching ? (
              <div className="p-4 text-sm text-muted text-center">
                Searching...
              </div>
            ) : (
              searchResults.map((issue, i) => (
                <button
                  key={issue._id}
                  onClick={() => {
                    router.push(`/issues/${issue._id}`);
                    clearSearch();
                  }}
                  className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-surface-secondary transition-colors border-b border-default last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-default truncate">
                      {issue.title}
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      {generateIssueId(i)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={issue.status} />
                    <PriorityIndicator priority={issue.priority} />
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {showFilters && (
        <div className="mb-6">
          <FilterBar
            search={searchQuery}
            status={activeTab}
            priority={priority}
            sort={sort}
            onSearchChange={handleSearch}
            onStatusChange={(val) => {
              setActiveTab(val);
              setPage(1);
            }}
            onPriorityChange={(val) => {
              setPriority(val);
              setPage(1);
            }}
            onSortChange={(val) => {
              setSort(val);
              setPage(1);
            }}
          />
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setPage(1);
              }}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab.key
                  ? "bg-default text-default bg-opacity-100 font-semibold"
                  : "text-muted hover:text-default hover:bg-surface-secondary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-medium text-muted sr-only">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => {
              setPriority(e.target.value);
              setPage(1);
            }}
            className="input-field text-sm pe-4"
          >
            {PRIORITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="pe-2">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 msg-error border rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 py-3 border-b border-default last:border-0"
              >
                <div className="flex-1 h-5 bg-surface-tertiary rounded" />
                <div className="w-24 h-5 bg-surface-tertiary rounded" />
                <div className="w-16 h-5 bg-surface-tertiary rounded" />
                <div className="w-8 h-8 bg-surface-tertiary rounded-full" />
              </div>
            ))}
          </div>
        ) : issues.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No issues found"
              description={
                activeTab || priority
                  ? "No issues match the selected filters."
                  : "Create your first issue to get started."
              }
              action={
                activeTab || priority
                  ? undefined
                  : { label: "Create Issue", href: "/issues/new" }
              }
            />
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-default">
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                    Issue
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                    Assignee
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue, i) => (
                  <tr
                    key={issue._id}
                    className="border-b border-default last:border-0 hover:bg-row-hover transition-colors cursor-pointer"
                    onClick={() => router.push(`/issues/${issue._id}`)}
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-default">
                        {issue.title}
                      </p>
                      <p className="text-xs text-muted mt-0.5">
                        {generateIssueId(
                          (meta ? (meta.page - 1) * meta.limit : 0) + i,
                        )}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={issue.status} />
                    </td>
                    <td className="px-6 py-4">
                      <PriorityIndicator priority={issue.priority} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Avatar name={issue.assignee} size="sm" />
                        <span className="text-sm text-secondary">
                          {issue.assignee || "Unassigned"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted">
                        {formatRelativeTime(issue.createdAt)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex items-center justify-between px-6 py-4 border-t border-default">
              <p className="text-sm text-muted">
                Showing {startItem}&ndash;{endItem} of {meta?.total ?? 0} issues
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!meta || meta.page <= 1}
                  className="btn-secondary text-xs px-3 py-1.5"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!meta || meta.page >= meta.totalPages}
                  className="btn-secondary text-xs px-3 py-1.5"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
