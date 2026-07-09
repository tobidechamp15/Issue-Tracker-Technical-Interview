import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
          Mini Issue Tracking System
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
          A lightweight issue tracker built with Next.js, TypeScript, and
          MongoDB. Track tasks, manage priorities, and monitor progress with a
          clean dashboard.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Create Account
          </Link>
        </div>
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-1">
              📋 Track Issues
            </h3>
            <p className="text-sm text-gray-600">
              Create, update, and organize issues with status and priority
              labels.
            </p>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-1">📊 Dashboard</h3>
            <p className="text-sm text-gray-600">
              View metrics at a glance — total, open, in progress, closed, and
              overdue.
            </p>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-1">🔒 Secure</h3>
            <p className="text-sm text-gray-600">
              JWT authentication with httpOnly cookies and bcrypt password
              hashing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
