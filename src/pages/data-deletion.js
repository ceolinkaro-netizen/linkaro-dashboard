import { useState } from "react";
import Head from "next/head";
import Image from "next/image";

const GEIST = "'Geist', sans-serif";
const PP_MORI = "'PP Mori', sans-serif";
const ORANGE = "#FE5900";

export default function DataDeletion() {
  const [form, setForm] = useState({ name: "", email: "", accountType: "", reason: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/data-deletion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Something went wrong. Please try again.");
        setStatus("error");
      } else {
        setStatus("success");
      }
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: 10,
    padding: "clamp(10px, 1vw, 14px) clamp(12px, 1.2vw, 16px)",
    fontFamily: GEIST,
    fontSize: "clamp(13px, 1.1vw, 15px)",
    color: "#ffffff",
    outline: "none",
    transition: "border-color 0.15s",
  };

  const labelStyle = {
    fontFamily: GEIST,
    fontWeight: 500,
    fontSize: "clamp(12px, 1vw, 14px)",
    color: "rgba(255,255,255,0.7)",
    display: "block",
    marginBottom: 7,
  };

  return (
    <>
      <Head>
        <title>Data Deletion Request | Linkaro</title>
      </Head>

      <div
        style={{
          minHeight: "100vh",
          background: "#000f2c",
          padding: "clamp(24px, 5vw, 64px) clamp(16px, 4vw, 24px)",
        }}
      >
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          {/* Logo */}
          <Image
            src="/logo.png"
            alt="Linkaro"
            width={140}
            height={70}
            style={{
              width: "clamp(100px, 10vw, 140px)",
              height: "auto",
              marginBottom: "clamp(24px, 3vw, 40px)",
            }}
          />

          {/* Title */}
          <h1
            style={{
              fontFamily: PP_MORI,
              fontWeight: 600,
              fontSize: "clamp(24px, 3vw, 36px)",
              letterSpacing: "-0.02em",
              color: "#ffffff",
              margin: "0 0 10px 0",
            }}
          >
            Data Deletion Request
          </h1>
          <p
            style={{
              fontFamily: GEIST,
              fontSize: "clamp(13px, 1.1vw, 15px)",
              color: "rgba(255,255,255,0.55)",
              margin: "0 0 clamp(28px, 3.5vw, 48px) 0",
              lineHeight: 1.65,
            }}
          >
            Submit this form to request deletion of your Linkaro account and associated data.
            We will process your request within <strong style={{ color: "rgba(255,255,255,0.8)" }}>30 days</strong> and
            send a confirmation to the email address you provide. For questions, contact us at{" "}
            <a href="mailto:linkaro.support@gmail.com" style={{ color: ORANGE, textDecoration: "none" }}>
              linkaro.support@gmail.com
            </a>.
          </p>

          {status === "success" ? (
            /* ── Success state ── */
            <div
              style={{
                background: "rgba(20,202,116,0.08)",
                border: "1px solid rgba(20,202,116,0.25)",
                borderRadius: 16,
                padding: "clamp(28px, 3.5vw, 48px) clamp(24px, 3vw, 40px)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "rgba(20,202,116,0.15)",
                  border: "1px solid rgba(20,202,116,0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px auto",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="#14CA74" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2
                style={{
                  fontFamily: PP_MORI,
                  fontWeight: 600,
                  fontSize: "clamp(18px, 1.8vw, 24px)",
                  color: "#14CA74",
                  margin: "0 0 12px 0",
                }}
              >
                Request Submitted
              </h2>
              <p
                style={{
                  fontFamily: GEIST,
                  fontSize: "clamp(13px, 1.1vw, 15px)",
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                We have received your data deletion request. You will receive a confirmation
                at <strong style={{ color: "rgba(255,255,255,0.85)" }}>{form.email}</strong> once
                your request has been processed. This typically takes up to 30 days.
              </p>
            </div>
          ) : (
            /* ── Form ── */
            <form onSubmit={handleSubmit} noValidate>
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16,
                  padding: "clamp(20px, 2.5vw, 36px)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "clamp(16px, 1.8vw, 24px)",
                }}
              >
                {/* Full Name */}
                <div>
                  <label htmlFor="name" style={labelStyle}>
                    Full Name <span style={{ color: ORANGE }}>*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(254,89,0,0.5)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.14)")}
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" style={labelStyle}>
                    Email Address <span style={{ color: ORANGE }}>*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email address used for your Linkaro account"
                    value={form.email}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(254,89,0,0.5)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.14)")}
                  />
                </div>

                {/* Account Type */}
                <div>
                  <label htmlFor="accountType" style={labelStyle}>
                    Account Type
                  </label>
                  <select
                    id="accountType"
                    name="accountType"
                    value={form.accountType}
                    onChange={handleChange}
                    style={{
                      ...inputStyle,
                      cursor: "pointer",
                      appearance: "none",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1L6 7L11 1' stroke='rgba(255,255,255,0.4)' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 14px center",
                      paddingRight: 38,
                    }}
                  >
                    <option value="" style={{ background: "#000f2c" }}>Select account type</option>
                    <option value="Consumer" style={{ background: "#000f2c" }}>Consumer (Customer)</option>
                    <option value="Service Provider" style={{ background: "#000f2c" }}>Service Provider</option>
                    <option value="Not sure" style={{ background: "#000f2c" }}>Not sure</option>
                  </select>
                </div>

                {/* Reason */}
                <div>
                  <label htmlFor="reason" style={labelStyle}>
                    Reason for deletion{" "}
                    <span style={{ color: "rgba(255,255,255,0.35)", fontWeight: 400 }}>(optional)</span>
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    placeholder="Tell us why you want to delete your account (optional)"
                    value={form.reason}
                    onChange={handleChange}
                    rows={4}
                    style={{
                      ...inputStyle,
                      resize: "vertical",
                      minHeight: 100,
                      lineHeight: 1.6,
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(254,89,0,0.5)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.14)")}
                  />
                </div>

                {/* Error */}
                {status === "error" && (
                  <div
                    style={{
                      background: "rgba(255,77,77,0.1)",
                      border: "1px solid rgba(255,77,77,0.3)",
                      borderRadius: 8,
                      padding: "10px 14px",
                      fontFamily: GEIST,
                      fontSize: "clamp(12px, 1vw, 13px)",
                      color: "#FF6B6B",
                    }}
                  >
                    {errorMsg}
                  </div>
                )}

                {/* Notice */}
                <p
                  style={{
                    fontFamily: GEIST,
                    fontSize: "clamp(11px, 0.9vw, 13px)",
                    color: "rgba(255,255,255,0.35)",
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  By submitting this form, you acknowledge that account deletion is irreversible.
                  Linkaro may retain certain records for up to 3 years for legal compliance as described
                  in our{" "}
                  <a href="/privacy-policy" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "underline" }}>
                    Privacy Policy
                  </a>.
                </p>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  style={{
                    width: "100%",
                    padding: "clamp(12px, 1.2vw, 16px)",
                    background: status === "loading" ? "rgba(254,89,0,0.5)" : ORANGE,
                    border: "none",
                    borderRadius: 10,
                    fontFamily: GEIST,
                    fontWeight: 600,
                    fontSize: "clamp(14px, 1.1vw, 16px)",
                    color: "#ffffff",
                    cursor: status === "loading" ? "not-allowed" : "pointer",
                    transition: "background 0.15s, opacity 0.15s",
                  }}
                >
                  {status === "loading" ? "Submitting…" : "Submit Deletion Request"}
                </button>
              </div>
            </form>
          )}

          {/* Footer */}
          <p
            style={{
              fontFamily: GEIST,
              fontSize: "clamp(11px, 0.9vw, 13px)",
              color: "rgba(255,255,255,0.25)",
              textAlign: "center",
              marginTop: "clamp(32px, 4vw, 56px)",
            }}
          >
            © {new Date().getFullYear()} Linkaro. All rights reserved.{" "}
            <a href="/privacy-policy" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "underline" }}>
              Privacy Policy
            </a>{" "}
            ·{" "}
            <a href="/terms-of-services" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "underline" }}>
              Terms of Service
            </a>
          </p>
        </div>
      </div>

      <style>{`
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.25); }
        select option { color: #ffffff; }
      `}</style>
    </>
  );
}
