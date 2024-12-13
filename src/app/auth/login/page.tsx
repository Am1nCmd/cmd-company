"use client";

import { signIn, useSession, SessionProvider } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";

export default function LoginPage() {
  return (
    <SessionProvider>
      <LoginContent />
    </SessionProvider>
  );
}

function LoginContent() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [require2FA, setRequire2FA] = useState(false);
  const [error, setError] = useState("");

  const { data: session, status } = useSession();

  if (status === "authenticated") {
    router.push("/dashboard");
  }

  const handleCredentialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        if (result.error.includes("2FA")) {
          setRequire2FA(true);
          setStep(2);
        } else {
          setError(result.error);
        }
      } else {
        // router.push("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please check your credentials.");
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signIn("credentials", {
        twoFactorCode: twoFactorCode,
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("2FA error:", err);
      setError("2FA failed. Please check your code.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      {step === 1 ? (
        <form
          onSubmit={handleCredentialSubmit}
          className="space-y-4 w-full max-w-md p-6"
        >
          <h2 className="text-2xl font-bold mb-6">Login</h2>
          <div>
            <label htmlFor="email" className="block mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                console.log("Email changed:", e.target.value);
              }}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                console.log("Password changed:", e.target.value);
              }}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Login
          </button>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 text-white-600 hover:text-white-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back
          </Link>
        </form>
      ) : (
        <form
          onSubmit={handle2FASubmit}
          className="space-y-4 w-full max-w-md p-6"
        >
          <h2 className="text-2xl font-bold mb-6">Enter 2FA Code</h2>
          <div>
            <label htmlFor="2fa-code" className="block mb-2">
              2FA Code
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value)}
              required
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Verify
          </button>
        </form>
      )}
    </div>
  );
}
