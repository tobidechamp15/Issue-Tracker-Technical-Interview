import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-subtle mb-4">404</h1>
        <h2 className="text-xl font-semibold text-default mb-2">
          Page not found
        </h2>
        <p className="text-muted mb-6">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className="btn-primary">
          Go Home
        </Link>
      </div>
    </div>
  );
}
