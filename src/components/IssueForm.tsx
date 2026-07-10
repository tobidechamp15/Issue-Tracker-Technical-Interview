"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";

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
  onCancel?: () => void;
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
  onCancel,
}: IssueFormProps) {
  const [form, setForm] = useState<IssueFormData>({
    ...defaultData,
    ...initialData,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  function validate(field: string, value: string): string {
    switch (field) {
      case "title":
        if (!value.trim()) return "Title is required";
        if (value.trim().length < 3)
          return "Title must be at least 3 characters";
        return "";
      default:
        return "";
    }
  }

  function handleChange(field: keyof IssueFormData) {
    return (
      e: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const value = e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      if (touched[field]) {
        const err = validate(field, value);
        setErrors((prev) => {
          const next = { ...prev };
          if (err) next[field] = err;
          else delete next[field];
          return next;
        });
      }
    };
  }

  function handleBlur(field: keyof IssueFormData) {
    return () => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const err = validate(field, form[field]);
      setErrors((prev) => {
        const next = { ...prev };
        if (err) next[field] = err;
        else delete next[field];
        return next;
      });
    };
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Validate all fields
    const newErrors: Record<string, string> = {};
    const titleErr = validate("title", form.title);
    if (titleErr) newErrors.title = titleErr;
    setErrors(newErrors);
    setTouched({ title: true });

    if (Object.keys(newErrors).length > 0) return;
    await onSubmit(form);
  }

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors";
  const errorClass = "border-red-300 focus:ring-red-500 focus:border-red-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={form.title}
          onChange={handleChange("title")}
          onBlur={handleBlur("title")}
          className={`${inputClass} ${errors.title ? errorClass : ""}`}
          placeholder="Brief summary of the issue"
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title}</p>
        )}
      </div>

      {/* Description */}
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
          onChange={handleChange("description")}
          rows={4}
          className={inputClass + " resize-y"}
          placeholder="Detailed description (optional)"
        />
      </div>

      {/* Status + Priority row */}
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
            onChange={handleChange("status")}
            className={inputClass + " bg-white"}
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
            onChange={handleChange("priority")}
            className={inputClass + " bg-white"}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* Assignee + Due Date row */}
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
            onChange={handleChange("assignee")}
            className={inputClass}
            placeholder="Name or email"
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
            onChange={handleChange("dueDate")}
            className={inputClass}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {loading && <Spinner />}
          {submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-lg transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
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
