"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import IssueForm, { type IssueFormData } from "@/components/IssueForm";
import Badge, { statusColor, formatStatus } from "@/components/Badge";
import { formatDate, isOverdue } from "@/lib/format";

interface Issue {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function IssueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    async function fetchIssue() {
      try {
        const res = await api.get<Issue>(`/api/issues/${id}`);
        setIssue(res.data);
      } catch (err) {
        if (err instanceof Error && err.message.includes("401")) {
          router.push("/login");
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load issue");
      } finally {
        setLoading(false);
      }
    }
    fetchIssue();
  }, [id, router]);

  async function handleUpdate(data: IssueFormData) {
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
      };
      const res = await api.put<Issue>(`/api/issues/${id}`, payload);
      setIssue(res.data);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update issue");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setError("");
    try {
      await api.delete(`/api/issues/${id}`);
      router.push("/issues");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete issue");
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
        <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
          <div className="h-5 bg-gray-200 rounded w-3/4" />
          <div className="h-16 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (error && !issue) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!issue) return null;

  const overdue = isOverdue(issue.dueDate, issue.status);

  if (editing) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-base font-bold text-gray-900 mb-6">Edit Issue</h1>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <IssueForm
            initialData={{
              title: issue.title,
              description: issue.description,
              status: issue.status,
              priority: issue.priority,
              assignee: issue.assignee,
              dueDate: issue.dueDate
                ? new Date(issue.dueDate).toISOString().split("T")[0]
                : "",
            }}
            onSubmit={handleUpdate}
            submitLabel="Save Changes"
            loading={saving}
            onCancel={() => setEditing(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-base font-bold text-gray-900">{issue.title}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant="status" value={issue.status} />
            <Badge variant="priority" value={issue.priority} />
            {overdue && <Badge variant="status" value="overdue" />}
          </div>
        </div>
        <button
          onClick={() => setEditing(true)}
          className="px-4 py-2 border border-blue-300 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          Edit
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Body */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
        {/* Description */}
        <div>
          <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Description
          </h2>
          <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
            {issue.description || "No description provided."}
          </p>
        </div>

        {/* Metadata grid */}
        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100">
          <div>
            <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Assignee
            </h2>
            <p className="text-sm text-gray-900">
              {issue.assignee || "Unassigned"}
            </p>
          </div>
          <div>
            <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Due Date
            </h2>
            <p className="text-sm text-gray-900">
              {formatDate(issue.dueDate, { includeYear: true })}
            </p>
          </div>
          <div>
            <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Created
            </h2>
            <p className="text-sm text-gray-900">
              {formatDate(issue.createdAt, { includeYear: true })}
            </p>
          </div>
          <div>
            <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Updated
            </h2>
            <p className="text-sm text-gray-900">
              {formatDate(issue.updatedAt, { includeYear: true })}
            </p>
          </div>
        </div>

        {/* Delete */}
        <div className="border-t border-gray-100 pt-4">
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="px-4 py-2 border border-red-300 text-red-700 text-sm font-medium rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
            >
              Delete Issue
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                Delete this issue permanently?
              </span>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
              >
                {deleting ? "Deleting..." : "Yes, delete"}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
