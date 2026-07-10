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
      await api.post("/api/issues", {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
      });
      router.push("/issues");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create issue");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Create New Issue</h1>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <IssueForm
          onSubmit={handleSubmit}
          submitLabel="Create Issue"
          loading={loading}
          onCancel={() => router.push("/issues")}
        />
      </div>
    </div>
  );
}
