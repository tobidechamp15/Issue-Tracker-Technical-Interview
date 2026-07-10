"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate(f: string, v: string): string {
    if (f === "name") {
      if (!v.trim()) return "Name is required";
      if (v.trim().length < 2) return "Name must be at least 2 characters";
      return "";
    }
    if (f === "email") {
      if (!v.trim()) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Invalid email address";
      return "";
    }
    if (f === "password") {
      if (!v) return "Password is required";
      if (v.length < 6) return "Password must be at least 6 characters";
      return "";
    }
    return "";
  }

  function gv(f: string): string {
    if (f === "name") return name;
    if (f === "email") return email;
    return password;
  }
  function sv(f: string, v: string) {
    if (f === "name") setName(v);
    else if (f === "email") setEmail(v);
    else setPassword(v);
  }

  function hc(f: string) {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      sv(f, v);
      if (touched[f]) {
        const err = validate(f, v);
        setErrors((p) => {
          const n = { ...p };
          if (err) n[f] = err;
          else delete n[f];
          return n;
        });
      }
    };
  }

  function hb(f: string) {
    return () => {
      setTouched((p) => ({ ...p, [f]: true }));
      const err = validate(f, gv(f));
      setErrors((p) => {
        const n = { ...p };
        if (err) n[f] = err;
        else delete n[f];
        return n;
      });
    };
  }

  async function hs(e: FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    for (const f of ["name", "email", "password"] as const) {
      const err = validate(f, gv(f));
      if (err) newErrors[f] = err;
    }
    setErrors(newErrors);
    setTouched({ name: true, email: true, password: true });
    if (Object.keys(newErrors).length > 0) return;
    setLoading(true);
    setServerError("");
    try {
      await register(name, email, password);
      router.push("/dashboard");
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Registration failed",
      );
    } finally {
      setLoading(false);
    }
  }

  const ic =
    "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors";
  const ec = "border-red-300 focus:ring-red-500 focus:border-red-500";

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-bold text-center mb-8">Create Account</h1>
        {serverError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {serverError}
          </div>
        )}
        <form
          onSubmit={hs}
          className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4"
          noValidate
        >
          {["name", "email", "password"].map((f) => (
            <div key={f}>
              <label
                htmlFor={f}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {f === "name" ? "Name" : f === "email" ? "Email" : "Password"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                id={f}
                type={
                  f === "password"
                    ? "password"
                    : f === "email"
                      ? "email"
                      : "text"
                }
                value={gv(f)}
                onChange={hc(f)}
                onBlur={hb(f)}
                className={`${ic} ${errors[f] ? ec : ""}`}
                placeholder={
                  f === "name"
                    ? "Your name"
                    : f === "email"
                      ? "you@example.com"
                      : "Min 6 characters"
                }
              />
              {errors[f] && (
                <p className="text-red-500 text-xs mt-1">{errors[f]}</p>
              )}
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Spinner />}
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already registered?{" "}
          <Link
            href="/login"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Sign in
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
