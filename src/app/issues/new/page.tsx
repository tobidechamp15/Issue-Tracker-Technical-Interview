"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import IssueForm, { type IssueFormData } from "@/components/IssueForm";

export default function NewIssuePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(data: IssueFormData) {
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
      };
      await api.post("/api/issues", payload);
      router.push("/issues");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create issue");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Create New Issue
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <IssueForm
          onSubmit={handleSubmit}
          submitLabel="Create Issue"
          loading={loading}
        />
      </div>
    </div>
  );
}
