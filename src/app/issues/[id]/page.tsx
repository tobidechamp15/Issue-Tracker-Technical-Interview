"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import IssueForm, { type IssueFormData } from "@/components/IssueForm";

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
        <div className="h-8 bg-gray-200 rounded w-48 mb-4" />
        <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
          <div className="h-5 bg-gray-200 rounded w-3/4" />
          <div className="h-20 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (error && !issue) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!issue) return null;

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

  if (editing) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Issue</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
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
          />
          <button
            onClick={() => setEditing(false)}
            className="mt-3 text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{issue.title}</h1>
          <div className="flex gap-2 mt-2">
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[issue.status]}`}
            >
              {issue.status.replace("_", " ")}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[issue.priority]}`}
            >
              {issue.priority}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600"
          >
            Edit
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
        <div>
          <h2 className="text-sm font-medium text-gray-500 mb-2">
            Description
          </h2>
          <p className="text-gray-900 whitespace-pre-wrap">
            {issue.description || "No description provided."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h2 className="text-sm font-medium text-gray-500 mb-1">Assignee</h2>
            <p className="text-gray-900">{issue.assignee || "Unassigned"}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500 mb-1">Due Date</h2>
            <p className="text-gray-900">
              {issue.dueDate
                ? new Date(issue.dueDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : "No due date"}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500 mb-1">Created</h2>
            <p className="text-gray-900 text-sm">
              {new Date(issue.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500 mb-1">Updated</h2>
            <p className="text-gray-900 text-sm">
              {new Date(issue.updatedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
            >
              Delete Issue
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700">Are you sure?</span>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
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
