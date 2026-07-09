"use client";

import { useState } from "react";

export interface IssueFormData {
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  dueDate: string;
}

interface IssueFormProps {
  initialData?: Partial<IssueFormData>;
  onSubmit: (data: IssueFormData) => Promise<void>;
  submitLabel: string;
  loading?: boolean;
  errors?: Record<string, string>;
}

const defaultData: IssueFormData = {
  title: "",
  description: "",
  status: "open",
  priority: "medium",
  assignee: "",
  dueDate: "",
};

export default function IssueForm({
  initialData,
  onSubmit,
  submitLabel,
  loading,
  errors: externalErrors,
}: IssueFormProps) {
  const [form, setForm] = useState<IssueFormData>({
    ...defaultData,
    ...initialData,
  });
  const [internalErrors, setInternalErrors] = useState<Record<string, string>>(
    {},
  );

  const errors = externalErrors || internalErrors;

  function updateField(field: keyof IssueFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setInternalErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setInternalErrors({});

    // Basic client-side validation
    const errs: Record<string, string> = {};
    if (!form.title.trim() || form.title.trim().length < 3) {
      errs.title = "Title must be at least 3 characters";
    }
    if (Object.keys(errs).length > 0) {
      setInternalErrors(errs);
      return;
    }

    await onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title *
        </label>
        <input
          id="title"
          type="text"
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="Issue title"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
          placeholder="Describe the issue..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            id="status"
            value={form.status}
            onChange={(e) => updateField("status", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Priority
          </label>
          <select
            id="priority"
            value={form.priority}
            onChange={(e) => updateField("priority", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="assignee"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Assignee
          </label>
          <input
            id="assignee"
            type="text"
            value={form.assignee}
            onChange={(e) => updateField("assignee", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Assignee name"
          />
        </div>

        <div>
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Due Date
          </label>
          <input
            id="dueDate"
            type="date"
            value={form.dueDate}
            onChange={(e) => updateField("dueDate", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading && <Spinner />}
        {loading ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
