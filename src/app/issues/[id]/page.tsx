"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import IssueForm, { type IssueFormData } from "@/components/IssueForm";
import StatusBadge from "@/components/StatusBadge";
import PriorityIndicator from "@/components/PriorityIndicator";
import Avatar from "@/components/Avatar";
import { formatDate } from "@/lib/format";

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
    (async () => {
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
    })();
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

  if (loading)
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-6 bg-surface-tertiary rounded w-48 mb-4" />
        <div className="card p-6 space-y-4">
          <div className="h-5 bg-surface-tertiary rounded w-3/4" />
          <div className="h-16 bg-surface-tertiary rounded" />
        </div>
      </div>
    );
  if (error && !issue)
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="p-4 msg-error border rounded-lg text-sm">{error}</div>
      </div>
    );
  if (!issue) return null;

  if (editing)
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-default mb-6">Edit Issue</h1>
        {error && (
          <div className="mb-4 p-3 msg-error border rounded-lg text-sm">
            {error}
          </div>
        )}
        <div className="card p-6">
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

  return (
    <div className="max-w-360 mx-auto px-4 py-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-default">{issue.title}</h1>
          <div className="flex items-center gap-3 mt-2">
            <StatusBadge status={issue.status} />
            <PriorityIndicator priority={issue.priority} />
          </div>
        </div>
        <button onClick={() => setEditing(true)} className="btn-secondary">
          Edit
        </button>
      </div>
      {error && (
        <div className="mb-4 p-3 msg-error border rounded-lg text-sm">
          {error}
        </div>
      )}
      <div className="card  space-y-6">
        <div>
          <h2 className="text-xs font-medium text-muted uppercase tracking-wide mb-2">
            Description
          </h2>
          <p className="text-sm text-default whitespace-pre-wrap leading-relaxed">
            {issue.description || "No description provided."}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-default">
          <div>
            <h2 className="text-xs font-medium text-muted uppercase tracking-wide mb-1">
              Assignee
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <Avatar name={issue.assignee} size="sm" />
              <span className="text-sm text-default">
                {issue.assignee || "Unassigned"}
              </span>
            </div>
          </div>
          <div>
            <h2 className="text-xs font-medium text-muted uppercase tracking-wide mb-1">
              Due Date
            </h2>
            <p className="text-sm text-default">
              {formatDate(issue.dueDate, { includeYear: true })}
            </p>
          </div>
          <div>
            <h2 className="text-xs font-medium text-muted uppercase tracking-wide mb-1">
              Created
            </h2>
            <p className="text-sm text-default">
              {formatDate(issue.createdAt, { includeYear: true })}
            </p>
          </div>
          <div>
            <h2 className="text-xs font-medium text-muted uppercase tracking-wide mb-1">
              Updated
            </h2>
            <p className="text-sm text-default">
              {formatDate(issue.updatedAt, { includeYear: true })}
            </p>
          </div>
        </div>
        <div className="border-t border-default pt-4">
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="px-4 py-2 border border-msg-error-border text-msg-error-text text-sm font-medium rounded-lg hover:bg-msg-error-bg focus:outline-none focus:ring-2 focus:ring-error transition-colors active:scale-[0.98]"
            >
              Delete Issue
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted">
                Delete this issue permanently?
              </span>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-error text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-error focus:ring-offset-2 disabled:opacity-50 transition-colors active:scale-[0.98]"
              >
                {deleting ? "Deleting..." : "Yes, delete"}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="btn-ghost"
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
