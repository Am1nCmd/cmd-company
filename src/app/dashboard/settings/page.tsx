"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const [QRCode, setQRCode] = useState("");
  const [secret, setSecret] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showQR, setShowQR] = useState(false);

  const setup2FA = async () => {
    try {
      const response = await fetch("/api/2fa/setup", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to set up 2FA. Please try again."
        );
      }

      setQRCode(data.qrCode);
      setSecret(data.secret);
      setShowQR(true);
    } catch (error) {
      console.error("Error setting up 2FA:", error);
      setError("Failed to set up 2FA. Please try again.");
    }
  };

  const verify2FA = async () => {
    try {
      const response = await fetch("/api/2fa/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: verificationCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to verify 2FA. Please try again.");
        return;
      }

      setSuccess("2FA activated successfully");
      setError("");
      setQRCode("");
      setSecret("");
      setVerificationCode("");
      setShowQR(false);
    } catch (error) {
      console.error("Error verifying 2FA:", error);
      setError("Failed to verify 2FA. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-4 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">
          Settings Two Factor Authenticator
        </h1>

        {!showQR ? (
          <button
            onClick={setup2FA}
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Activate 2FA
          </button>
        ) : (
          <>
            <div className="space-y-4">
              <div className="border border-gray-300 p-4 rounded-md">
                <h2 className="text-lg font-bold mb-2">Scan QR Code</h2>
                <div className="flex justify-center">
                  <Image src={QRCode} alt="QR Code" width={200} height={200} />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-white-600">
                  Input code manually to your authenticator app:
                </p>
                <div className="relative">
                  <input
                    type="text"
                    value={secret}
                    readOnly
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md font-mono text-sm"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(secret)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
                    title="Copy to clipboard"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="verificationCode" className="block mb-2">
                  Input code verification
                </label>
                <input
                  id="verificationCode"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="000000"
                />
              </div>
              <button
                onClick={verify2FA}
                className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
              >
                Verify Code
              </button>
            </div>
          </>
        )}

        <Link
          href="/dashboard/profile"
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
      </div>
    </div>
  );
}
