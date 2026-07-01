"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SuperAdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    securityKey: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/superadmin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/superadmin/dashboard");
      } else {
        setError(data.message || "Authentication failed. Please verify credentials.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .sa-page {
          min-height: 100vh;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
        }

        .sa-card {
          width: 100%;
          max-width: 380px;
          margin: 24px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 36px 32px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06);
        }

        .sa-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
        }

        .sa-logo-icon {
          width: 36px;
          height: 36px;
          background: #dc2626;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sa-logo-text {
          font-size: 15px;
          font-weight: 700;
          color: #111827;
          letter-spacing: -0.01em;
        }

        .sa-logo-sub {
          font-size: 11px;
          color: #9ca3af;
          font-weight: 400;
          margin-top: 1px;
        }

        .sa-heading {
          font-size: 20px;
          font-weight: 700;
          color: #111827;
          letter-spacing: -0.02em;
          margin-bottom: 4px;
        }

        .sa-subheading {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 24px;
          line-height: 1.5;
        }

        .sa-divider {
          height: 1px;
          background: #f3f4f6;
          margin-bottom: 22px;
        }

        .sa-error {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 10px 12px;
          margin-bottom: 16px;
          color: #dc2626;
          font-size: 12px;
          line-height: 1.5;
          animation: shake 0.3s ease;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }

        .sa-field {
          margin-bottom: 14px;
        }

        .sa-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 5px;
        }

        .sa-input-wrap {
          position: relative;
        }

        .sa-input {
          width: 100%;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 9px 36px 9px 12px;
          font-size: 13px;
          color: #111827;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
        }

        .sa-input::placeholder {
          color: #d1d5db;
        }

        .sa-input:focus {
          border-color: #dc2626;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.08);
        }

        .sa-input-icon {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          width: 16px;
          height: 16px;
          color: #d1d5db;
          cursor: pointer;
          transition: color 0.15s;
          background: none;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }

        .sa-input-icon:hover {
          color: #6b7280;
        }

        .sa-btn {
          width: 100%;
          padding: 10px;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          background: #dc2626;
          color: #ffffff;
          margin-top: 6px;
          transition: background 0.15s, transform 0.1s;
          letter-spacing: 0.01em;
        }

        .sa-btn:not(:disabled):hover {
          background: #b91c1c;
        }

        .sa-btn:not(:disabled):active {
          transform: scale(0.99);
        }

        .sa-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .sa-spinner {
          display: inline-block;
          width: 13px;
          height: 13px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin-right: 7px;
          vertical-align: middle;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .sa-footer {
          text-align: center;
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid #f3f4f6;
          font-size: 11px;
          color: #9ca3af;
          line-height: 1.6;
        }

        .sa-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 100px;
          padding: 3px 10px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #dc2626;
          margin-bottom: 16px;
        }

        .sa-badge-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #dc2626;
          animation: pulse-dot 2s infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      <div className="sa-page">
        <div className="sa-card">


          {/* Heading */}
          <h1 className="sa-heading">Sign in</h1>
          <p className="sa-subheading">Three-factor authentication required.</p>

          <div className="sa-divider" />

          {/* Error */}
          {error && (
            <div className="sa-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{flexShrink:0, marginTop:1}}>
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="sa-field">
              <label className="sa-label" htmlFor="sa-email">Admin Email</label>
              <div className="sa-input-wrap">
                <input
                  type="email"
                  id="sa-email"
                  required
                  autoComplete="email"
                  className="sa-input"
                  placeholder="admin@hospital.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <span className="sa-input-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
              </div>
            </div>

            <div className="sa-field">
              <label className="sa-label" htmlFor="sa-password">Password</label>
              <div className="sa-input-wrap">
                <input
                  type={showPw ? "text" : "password"}
                  id="sa-password"
                  required
                  autoComplete="current-password"
                  className="sa-input"
                  placeholder="••••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="sa-input-icon"
                  onClick={() => setShowPw(!showPw)}
                  tabIndex={-1}
                >
                  {showPw ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="sa-field">
              <label className="sa-label" htmlFor="sa-security-key">Security Key</label>
              <div className="sa-input-wrap">
                <input
                  type={showKey ? "text" : "password"}
                  id="sa-security-key"
                  required
                  className="sa-input"
                  placeholder="••••••••"
                  value={formData.securityKey}
                  onChange={(e) => setFormData({ ...formData, securityKey: e.target.value })}
                />
                <button
                  type="button"
                  className="sa-input-icon"
                  onClick={() => setShowKey(!showKey)}
                  tabIndex={-1}
                >
                  {showKey ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="sa-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="sa-spinner" />
                  Authenticating...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>


        </div>
      </div>
    </>
  );
}
