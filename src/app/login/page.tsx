"use client";

import { useState, type ChangeEvent, type FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate(field: string, value: string): string {
    if (field === "email") {
      if (!value.trim()) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return "Invalid email address";
      return "";
    }
    if (field === "password") {
      if (!value) return "Password is required";
      return "";
    }
    return "";
  }

  function handleChange(field: string) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (field === "email") setEmail(value);
      else setPassword(value);
      if (touched[field]) {
        const err = validate(field, value);
        setErrors((prev) => {
          const n = { ...prev };
          if (err) n[field] = err;
          else delete n[field];
          return n;
        });
      }
    };
  }

  function handleBlur(field: string) {
    return () => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const val = field === "email" ? email : password;
      const err = validate(field, val);
      setErrors((prev) => {
        const n = { ...prev };
        if (err) n[field] = err;
        else delete n[field];
        return n;
      });
    };
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const eErr = validate("email", email),
      pErr = validate("password", password);
    const newErrors: Record<string, string> = {};
    if (eErr) newErrors.email = eErr;
    if (pErr) newErrors.password = pErr;
    setErrors(newErrors);
    setTouched({ email: true, password: true });
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    setServerError("");
    try {
      await login(email, password);
      router.push(redirectTo);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-bold text-center mb-8">Sign In</h1>

        {serverError && (
          <div className="mb-4 p-3 msg-error border rounded-lg text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="card p-6 space-y-4" noValidate>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-secondary mb-1"
            >
              Email <span className="text-error-strong">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleChange("email")}
              onBlur={handleBlur("email")}
              className={`input-field ${errors.email ? "input-error" : ""}`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-error-strong text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-secondary mb-1"
            >
              Password <span className="text-error-strong">*</span>
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={handleChange("password")}
              onBlur={handleBlur("password")}
              className={`input-field ${errors.password ? "input-error" : ""}`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-error-strong text-xs mt-1">
                {errors.password}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full gap-2"
          >
            {loading && <Spinner />}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="text-center text-sm text-muted mt-4">
          No account?{" "}
          <Link
            href="/register"
            className="text-primary font-medium hover:text-primary-hover transition-colors"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
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

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
