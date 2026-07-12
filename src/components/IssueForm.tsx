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
    if (field === "title") {
      if (!value.trim()) return "Title is required";
      if (value.trim().length < 3) return "Title must be at least 3 characters";
      return "";
    }
    return "";
  }

  function hc(field: keyof IssueFormData) {
    return (
      e: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const v = e.target.value;
      setForm((p) => ({ ...p, [field]: v }));
      if (touched[field]) {
        const err = validate(field, v);
        setErrors((p) => {
          const n = { ...p };
          if (err) n[field] = err;
          else delete n[field];
          return n;
        });
      }
    };
  }

  function hb(field: keyof IssueFormData) {
    return () => {
      setTouched((p) => ({ ...p, [field]: true }));
      const err = validate(field, form[field]);
      setErrors((p) => {
        const n = { ...p };
        if (err) n[field] = err;
        else delete n[field];
        return n;
      });
    };
  }

  async function hs(e: FormEvent) {
    e.preventDefault();
    const te = validate("title", form.title);
    const newErrors: Record<string, string> = {};
    if (te) newErrors.title = te;
    setErrors(newErrors);
    setTouched({ title: true });
    if (Object.keys(newErrors).length > 0) return;
    await onSubmit(form);
  }

  return (
    <form onSubmit={hs} className="space-y-4" noValidate>
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-secondary mb-1"
        >
          Title <span className="text-error-strong">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={form.title}
          onChange={hc("title")}
          onBlur={hb("title")}
          className={`input-field ${errors.title ? "input-error" : ""}`}
          placeholder="Brief summary of the issue"
        />
        {errors.title && (
          <p className="text-error-strong text-xs mt-1">{errors.title}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-secondary mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          value={form.description}
          onChange={hc("description")}
          rows={4}
          className="input-field resize-y"
          placeholder="Detailed description (optional)"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-secondary mb-1"
          >
            Status
          </label>
          <select
            id="status"
            value={form.status}
            onChange={hc("status")}
            className="input-field"
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Done</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-secondary mb-1"
          >
            Priority
          </label>
          <select
            id="priority"
            value={form.priority}
            onChange={hc("priority")}
            className="input-field"
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
            className="block text-sm font-medium text-secondary mb-1"
          >
            Assignee
          </label>
          <input
            id="assignee"
            type="text"
            value={form.assignee}
            onChange={hc("assignee")}
            className="input-field"
            placeholder="Name or email"
          />
        </div>
        <div>
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium text-secondary mb-1"
          >
            Due Date
          </label>
          <input
            id="dueDate"
            type="date"
            value={form.dueDate}
            onChange={hc("dueDate")}
            className="input-field"
          />
        </div>
      </div>
      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary gap-2">
          {loading && <Spinner />}
          {submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-ghost">
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
