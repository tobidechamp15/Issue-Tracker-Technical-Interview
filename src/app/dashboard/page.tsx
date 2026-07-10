"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import MetricCard from "@/components/MetricCard";
import type { DashboardMetrics as Metrics } from "@/services/issue.service";
import { AlertCircle, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const res = await api.get<Metrics>("/api/dashboard/metrics");
        setMetrics(res.data);
      } catch (err) {
        if (err instanceof Error && err.message.includes("401")) {
          router.push("/login");
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
  }, [router]);

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor your project issues at a glance.</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
          <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors">
            Generate Report
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-20 mb-3" />
              <div className="h-8 bg-gray-200 rounded w-16" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            label="Total Issues"
            value={metrics?.total ?? 0}
            icon={AlertCircle}
            iconBg="bg-indigo-500"
            trend={{ direction: "up", percentage: 12 }}
          />
          <MetricCard
            label="Resolved"
            value={metrics?.closed ?? 0}
            icon={CheckCircle2}
            iconBg="bg-emerald-500"
            trend={{ direction: "up", percentage: 8 }}
          />
          <MetricCard
            label="Pending"
            value={(metrics?.open ?? 0) + (metrics?.inProgress ?? 0)}
            icon={Clock}
            iconBg="bg-amber-500"
            trend={{ direction: "down", percentage: 3 }}
          />
          <MetricCard
            label="Overdue"
            value={metrics?.overdue ?? 0}
            icon={AlertTriangle}
            iconBg="bg-red-500"
            trend={{ direction: "down", percentage: 5 }}
          />
        </div>
      )}
    </div>
  );
}
