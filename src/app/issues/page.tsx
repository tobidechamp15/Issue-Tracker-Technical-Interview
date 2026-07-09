"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import FilterBar from "@/components/FilterBar";
import IssueCard from "@/components/IssueCard";
import Link from "next/link";

interface Issue {
  _id: string;
  title: string;
  status: string;
  priority: string;
  assignee: string;
  dueDate?: string | null;
  createdAt: string;
}

interface ListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function IssuesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [issues, setIssues] = useState<Issue[]>([]);
  const [meta, setMeta] = useState<ListMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [priority, setPriority] = useState(searchParams.get("priority") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    setError("");

    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (priority) params.set("priority", priority);
    params.set("sort", sort);
    params.set("page", String(page));
    params.set("limit", "10");

    try {
      const res = await api.get<Issue[]>(`/api/issues?${params.toString()}`);
      setIssues(res.data);
      if (res.meta) setMeta(res.meta as unknown as ListMeta);
    } catch (err) {
      if (err instanceof Error && err.message.includes("401")) {
        router.push("/login");
        return;
      }
      setError(err instanceof Error ? err.message : "Failed to load issues");
    } finally {
      setLoading(false);
    }
  }, [search, status, priority, sort, page, router]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleStatusChange(value: string) {
    setStatus(value);
    setPage(1);
  }

  function handlePriorityChange(value: string) {
    setPriority(value);
    setPage(1);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Issues</h1>
        <Link
          href="/issues/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          + New Issue
        </Link>
      </div>

      <FilterBar
        search={search}
        status={status}
        priority={priority}
        sort={sort}
        onSearchChange={handleSearchChange}
        onStatusChange={handleStatusChange}
        onPriorityChange={handlePriorityChange}
        onSortChange={setSort}
      />

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-6 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 animate-pulse"
            >
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="flex gap-2">
                <div className="h-4 bg-gray-200 rounded w-16" />
                <div className="h-4 bg-gray-200 rounded w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : issues.length === 0 ? (
        <div className="mt-6 text-center py-12 text-gray-500">
          <p className="text-lg">No issues found</p>
          <Link
            href="/issues/new"
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            Create your first issue
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-6 space-y-4">
            {issues.map((issue) => (
              <IssueCard key={issue._id} issue={issue} />
            ))}
          </div>

          {meta && meta.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {meta.page} of {meta.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= meta.totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
