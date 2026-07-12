"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import MetricCard from "@/components/MetricCard";
import StatusBadge from "@/components/StatusBadge";
import PriorityIndicator from "@/components/PriorityIndicator";
import Avatar from "@/components/Avatar";
import EmptyState from "@/components/EmptyState";
import type { DashboardMetrics as Metrics } from "@/services/issue.service";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { formatRelativeTime, generateIssueId } from "@/lib/format";

interface Issue {
  _id: string;
  title: string;
  status: string;
  priority: string;
  assignee: string;
  createdAt: string;
}

interface ListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [range, setRange] = useState(7);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [recentIssues, setRecentIssues] = useState<Issue[]>([]);
  const [issuesMeta, setIssuesMeta] = useState<ListMeta | null>(null);
  const [issuesLoading, setIssuesLoading] = useState(true);
  const [issuesError, setIssuesError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function fetchMetrics() {
      try {
        const res = await api.get<Metrics>(
          `/api/dashboard/metrics?range=${range}`,
        );
        if (!cancelled) setMetrics(res.data);
      } catch (err) {
        if (!cancelled) {
          if (err instanceof Error && err.message.includes("401")) {
            router.push("/login");
            return;
          }
          setError(
            err instanceof Error ? err.message : "Failed to load dashboard",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    setLoading(true);
    fetchMetrics();
    return () => {
      cancelled = true;
    };
  }, [router, range]);

  useEffect(() => {
    let cancelled = false;
    setIssuesLoading(true);
    api
      .get<Issue[]>(`/api/issues?limit=5&sort=newest&range=${range}`)
      .then((res) => {
        if (!cancelled) {
          setRecentIssues(res.data);
          if (res.meta) setIssuesMeta(res.meta as unknown as ListMeta);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          if (err instanceof Error && err.message.includes("401")) {
            router.push("/login");
            return;
          }
          setIssuesError(
            err instanceof Error ? err.message : "Failed to load issues",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setIssuesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [router, range]);

  if (error) {
    return (
      <div className="max-w-360 mx-auto px-4 py-8">
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
          {error === "Authentication required" && (
            <Link href="/login" className="ml-2 text-blue-600 underline">
              Login
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-8">
       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-default">
            Dashboard Overview
          </h1>
          <p className="text-sm text-muted mt-1">
            Monitor your project issues at a glance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            className="input-field min-w-35"
            value={range}
            onChange={(e) => setRange(Number(e.target.value))}
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <Link href="/issues/new" className="btn-primary min-w-29">
            + New Issue
          </Link>
        </div>
      </div>

       {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-4 bg-surface-tertiary rounded w-20 mb-3" />
              <div className="h-8 bg-surface-tertiary rounded w-16" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            label="Total Issues"
            value={metrics?.total ?? 0}
            icon={AlertCircle}
            iconBg="bg-blue-600"
            trend={{ direction: "up", percentage: 12 }}
          />
          <MetricCard
            label="Resolved"
            value={metrics?.closed ?? 0}
            icon={CheckCircle2}
            iconBg="bg-emerald-600"
            trend={{ direction: "up", percentage: 8 }}
          />
          <MetricCard
            label="Pending"
            value={(metrics?.open ?? 0) + (metrics?.inProgress ?? 0)}
            icon={Clock}
            iconBg="bg-amber-600"
            trend={{ direction: "down", percentage: 3 }}
          />
          <MetricCard
            label="Overdue"
            value={metrics?.overdue ?? 0}
            icon={AlertTriangle}
            iconBg="bg-red-600"
            trend={{ direction: "down", percentage: 5 }}
          />
        </div>
      )}


      <section className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-default">Recent Issues</h2>
            <p className="text-sm text-muted mt-0.5">
              Your latest {issuesMeta ? Math.min(issuesMeta.total, 5) : 0}{" "}
              {issuesMeta && issuesMeta.total === 1 ? "issue" : "issues"}
            </p>
          </div>
          <Link
            href="/issues"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            View all
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="card overflow-hidden">
          {issuesLoading ? (
            <div className="p-6 space-y-4 animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 py-3 border-b border-default last:border-0"
                >
                  <div className="flex-1 h-5 bg-surface-tertiary rounded" />
                  <div className="w-24 h-5 bg-surface-tertiary rounded" />
                  <div className="w-16 h-5 bg-surface-tertiary rounded" />
                  <div className="w-8 h-8 bg-surface-tertiary rounded-full" />
                </div>
              ))}
            </div>
          ) : issuesError ? (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm m-4">
              {issuesError}
            </div>
          ) : recentIssues.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title="No issues yet"
                description="Create your first issue to start tracking your tasks."
                action={{ label: "Create Issue", href: "/issues/new" }}
              />
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-default">
                    <th className="text-left px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider">
                      Issue
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider hidden sm:table-cell">
                      Status
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider hidden md:table-cell">
                      Priority
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider hidden lg:table-cell">
                      Assignee
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider hidden sm:table-cell">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentIssues.map((issue, i) => (
                    <tr
                      key={issue._id}
                      className="border-b border-default last:border-0 hover:bg-row-hover transition-colors cursor-pointer"
                      onClick={() => router.push("/issues")}
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-default">
                          {issue.title}
                        </p>
                        <p className="text-xs text-muted mt-0.5">
                          {generateIssueId(i)}
                        </p>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <StatusBadge status={issue.status} />
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <PriorityIndicator priority={issue.priority} />
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <Avatar name={issue.assignee} size="sm" />
                          <span className="text-sm text-secondary">
                            {issue.assignee || "Unassigned"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className="text-sm text-muted">
                          {formatRelativeTime(issue.createdAt)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>


              <div className="flex items-center justify-center px-6 py-4 border-t border-default">
                <Link
                  href="/issues"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  View all {issuesMeta?.total ?? 0} issues &rarr;
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
