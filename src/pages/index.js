import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import StatusToast from "@/components/toaster/toast";
import { apiFetch } from "@/lib/api";

const ORANGE = "#FE5900";
const INPUT_BG = "#4D4D4D";
const ERROR_COLOR = "#F62323";
const GEIST = "'Geist', sans-serif";
const PP_MORI = "'PP Mori', sans-serif";
const OTP_LENGTH = 6;
const TIMER_SECONDS = 90;

function validate(email, password) {
  const errs = {};
  if (!email.trim()) {
    errs.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errs.email = "Enter a valid email address.";
  }
  if (!password) {
    errs.password = "Password is required.";
  } else if (password.length < 6) {
    errs.password = "Password must be at least 6 characters.";
  }
  return errs;
}

function formatTimer(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export default function Home() {
  const router = useRouter();

  // ── Login step state ─────────────────────────────────────────────────────
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("admin");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ── OTP step state ───────────────────────────────────────────────────────
  const [step, setStep] = useState("login"); // "login" | "otp"
  const [pendingOtp, setPendingOtp] = useState("");
  const [otpDigits, setOtpDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [otpError, setOtpError] = useState(""); // "" | "incomplete" | "wrong"
  const [verifying, setVerifying] = useState(false);
  const [timer, setTimer] = useState(TIMER_SECONDS);
  const timerRef = useRef(null);
  const inputRefs = useRef([]);

  const [toast, setToast] = useState({ show: false, message: "", type: "error" });

  const categories = ["admin", "user manager", "ticket manager"];

  // ── Timer logic ──────────────────────────────────────────────────────────
  function startTimer() {
    clearInterval(timerRef.current);
    setTimer(TIMER_SECONDS);
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) { clearInterval(timerRef.current); return 0; }
        return t - 1;
      });
    }, 1000);
  }

  useEffect(() => () => clearInterval(timerRef.current), []);

  // ── Step 1: send OTP ─────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(email, password);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    try {
      const res = await apiFetch("/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ email, password, category: selectedCategory }),
      });
      const data = await res.json();

      if (!res.ok) {
        setToast({ show: true, message: data.message || "Login failed", type: "error" });
        return;
      }

      setPendingOtp(data.otp);
      setOtpDigits(Array(OTP_LENGTH).fill(""));
      setOtpError("");
      setStep("otp");
      startTimer();
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    } catch {
      setToast({ show: true, message: "Network error. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  // ── Step 2: verify OTP ───────────────────────────────────────────────────
  async function handleVerify() {
    const code = otpDigits.join("");
    if (code.length < OTP_LENGTH) { setOtpError("incomplete"); return; }
    if (code !== pendingOtp) { setOtpError("wrong"); return; }

    setVerifying(true);
    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password, category: selectedCategory }),
      });
      const data = await res.json();
      if (!res.ok) {
        setToast({ show: true, message: data.message || "Login failed", type: "error" });
        return;
      }
      router.push(data.redirectTo);
    } catch {
      setToast({ show: true, message: "Network error. Please try again.", type: "error" });
    } finally {
      setVerifying(false);
    }
  }

  async function handleResend() {
    if (timer > 0) return;
    setOtpDigits(Array(OTP_LENGTH).fill(""));
    setOtpError("");
    setLoading(true);
    try {
      const res = await apiFetch("/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ email, password, category: selectedCategory }),
      });
      const data = await res.json();
      if (!res.ok) {
        setToast({ show: true, message: data.message || "Failed to resend", type: "error" });
        return;
      }
      setPendingOtp(data.otp);
      startTimer();
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    } catch {
      setToast({ show: true, message: "Network error. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  // ── OTP box key handling ─────────────────────────────────────────────────
  function handleOtpChange(i, value) {
    const digit = value.replace(/\D/g, "").slice(-1);
    setOtpError("");
    const next = [...otpDigits];
    next[i] = digit;
    setOtpDigits(next);
    if (digit && i < OTP_LENGTH - 1) inputRefs.current[i + 1]?.focus();
  }

  function handleOtpKeyDown(i, e) {
    if (e.key === "Backspace") {
      if (otpDigits[i]) {
        const next = [...otpDigits];
        next[i] = "";
        setOtpDigits(next);
      } else if (i > 0) {
        inputRefs.current[i - 1]?.focus();
      }
    }
  }

  function handleOtpPaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, idx) => { next[idx] = ch; });
    setOtpDigits(next);
    setOtpError("");
    const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIdx]?.focus();
  }

  // ── Shared styles ────────────────────────────────────────────────────────
  const labelStyle = {
    fontFamily: GEIST, fontWeight: 400, fontSize: "clamp(10px, 0.76vw, 11px)",
    lineHeight: "12px", letterSpacing: "0.3px", color: "#ffffff",
    display: "block", marginBottom: "clamp(4px, 0.4vw, 6px)",
  };
  const errorStyle = {
    fontFamily: GEIST, fontWeight: 400, fontSize: "clamp(9px, 0.7vw, 11px)",
    color: ERROR_COLOR, marginTop: "clamp(3px, 0.3vw, 5px)", display: "block",
  };
  function inputStyle(hasError) {
    return {
      width: "100%", background: INPUT_BG,
      border: `1.5px solid ${hasError ? ERROR_COLOR : "transparent"}`,
      borderRadius: "140px",
      padding: "clamp(9px, 0.9vw, 13px) clamp(12px, 1vw, 16px)",
      color: "#ffffff", fontFamily: GEIST, fontWeight: 400,
      fontSize: "clamp(11px, 0.9vw, 14px)",
    };
  }

  const hasOtpError = otpError === "incomplete" || otpError === "wrong";
  const otpErrorMsg = otpError === "wrong"
    ? "Invalid verification code"
    : "Please enter the complete verification code";
  const isVerifyEnabled = otpDigits.join("").length === OTP_LENGTH && timer > 0 && !verifying;

  return (
    <>
      <StatusToast
        show={toast.show} message={toast.message} type={toast.type}
        onClose={() => setToast((t) => ({ ...t, show: false }))}
      />
      <Head><title>Linkaro</title></Head>
      <div style={{ minHeight: "100vh", background: "#000f2c", display: "flex", position: "relative", overflow: "hidden" }}>
        {/* Top-right gradient */}
        <div style={{
          position: "absolute", top: 0, right: 0, width: "55%", height: "70%",
          background: "radial-gradient(ellipse at 95% 2%, rgba(0,80,210,0.45) 0%, rgba(0,50,160,0.2) 35%, transparent 62%)",
          pointerEvents: "none", zIndex: 0,
        }} />

        {/* Left panel */}
        <div className="login-bg-panel" style={{
          width: "clamp(260px, 46%, 680px)",
          padding: "clamp(12px, 1.4vw, 20px) clamp(6px, 0.5vw, 8px) clamp(12px, 1.4vw, 20px) clamp(12px, 1.4vw, 20px)",
          flexShrink: 0, position: "relative", zIndex: 1,
        }}>
          <div style={{ width: "100%", height: "100%", borderRadius: "clamp(14px, 1.5vw, 22px)", overflow: "hidden", position: "relative" }}>
            <Image src="/login-background.png" alt="Linkaro background" fill style={{ objectFit: "cover" }} priority />
          </div>
        </div>

        {/* Right panel */}
        <div style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          padding: "clamp(24px, 4vw, 80px) clamp(24px, 3vw, 60px) clamp(24px, 4vw, 80px) clamp(10px, 1vw, 16px)",
          position: "relative", zIndex: 1,
        }}>

          {/* ── LOGIN STEP ─────────────────────────────────────────────── */}
          {step === "login" && (
            <form onSubmit={handleSubmit} noValidate style={{ width: "100%", maxWidth: "clamp(300px, 36vw, 510px)" }}>
              <div style={{ marginBottom: "clamp(16px, 2vw, 28px)" }}>
                <Image src="/logo.png" alt="Linkaro" width={187} height={93}
                  style={{ width: "clamp(120px, 13vw, 187px)", height: "auto" }} priority />
              </div>
              <h1 style={{
                fontFamily: PP_MORI, fontWeight: 600, fontSize: "clamp(22px, 2.36vw, 34px)",
                lineHeight: "clamp(22px, 2.01vw, 29px)", letterSpacing: "-0.02em",
                color: "#ffffff", margin: "0 0 clamp(6px, 0.7vw, 10px) 0",
              }}>Login to your account</h1>
              <p style={{
                fontFamily: GEIST, fontWeight: 400, fontSize: "clamp(13px, 1.32vw, 19px)",
                lineHeight: "clamp(16px, 1.46vw, 21px)", letterSpacing: "0.02em",
                color: "#ffffff", margin: "0 0 clamp(18px, 2.2vw, 32px) 0", opacity: 0.9,
              }}>Measure your advertising ROI and report website traffic.</p>

              {/* Email */}
              <div style={{ marginBottom: "clamp(10px, 1.1vw, 16px)" }}>
                <label style={labelStyle}>Email</label>
                <input type="email" placeholder="Enter email address" value={email}
                  onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((p) => ({ ...p, email: "" })); }}
                  style={inputStyle(!!errors.email)} />
                {errors.email && <span style={errorStyle}>{errors.email}</span>}
              </div>

              {/* Password */}
              <div style={{ marginBottom: "clamp(8px, 1vw, 14px)" }}>
                <label style={labelStyle}>Password</label>
                <div style={{ position: "relative" }}>
                  <input type={showPassword ? "text" : "password"} placeholder="Enter password" value={password}
                    onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors((p) => ({ ...p, password: "" })); }}
                    style={{ ...inputStyle(!!errors.password), paddingRight: "clamp(38px, 3vw, 48px)" }} />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} style={{
                    position: "absolute", right: "clamp(10px, 0.9vw, 14px)",
                    top: errors.password ? "calc(50% - 8px)" : "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", padding: 0,
                    display: "flex", alignItems: "center", lineHeight: 0,
                  }}>
                    <img src={showPassword ? "/eye-hide.ico" : "/eye.png"}
                      alt={showPassword ? "Hide" : "Show"}
                      style={{ width: "clamp(14px, 1.2vw, 18px)", height: "clamp(14px, 1.2vw, 18px)", objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.65 }} />
                  </button>
                </div>
                {errors.password && <span style={errorStyle}>{errors.password}</span>}
              </div>

              {/* Remember me + Forgot */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "clamp(12px, 1.5vw, 22px)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "clamp(6px, 0.55vw, 8px)" }}>
                  <button type="button" onClick={() => setRememberMe((v) => !v)} aria-label="Toggle remember me" style={{
                    width: "clamp(32px, 2.5vw, 38px)", height: "clamp(18px, 1.4vw, 21px)",
                    background: rememberMe ? ORANGE : "#555555", borderRadius: "100px",
                    border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s", padding: 0, flexShrink: 0,
                  }}>
                    <span style={{
                      position: "absolute", top: "50%", transform: "translateY(-50%)",
                      left: rememberMe ? "calc(100% - clamp(19px, 1.5vw, 22px))" : "2px",
                      width: "clamp(14px, 1.1vw, 17px)", height: "clamp(14px, 1.1vw, 17px)",
                      background: "#ffffff", borderRadius: "50%", transition: "left 0.2s",
                    }} />
                  </button>
                  <span style={{ fontFamily: GEIST, fontWeight: 400, fontSize: "clamp(10px, 0.76vw, 11px)", lineHeight: "12px", letterSpacing: "0.3px", color: "#ffffff" }}>
                    Remember me
                  </span>
                </div>
                <a href="#" style={{ fontFamily: GEIST, fontWeight: 500, fontSize: "clamp(10px, 0.76vw, 11px)", lineHeight: "12px", letterSpacing: "0.3px", color: "#007AFF", textDecoration: "none" }}>
                  Forgot password?
                </a>
              </div>

              {/* Category */}
              <div style={{ marginBottom: "clamp(12px, 1.5vw, 20px)" }}>
                <label style={{ fontFamily: GEIST, fontWeight: 400, fontSize: "clamp(10px, 0.83vw, 12px)", lineHeight: "1", letterSpacing: "0", color: "#ffffff", display: "block", marginBottom: "clamp(8px, 0.8vw, 12px)" }}>
                  Select Category
                </label>
                <div style={{ display: "flex", gap: "clamp(6px, 0.7vw, 10px)", flexWrap: "wrap" }}>
                  {categories.map((cat) => (
                    <button key={cat} type="button" onClick={() => setSelectedCategory(cat)} style={{
                      background: INPUT_BG,
                      border: `1.5px solid ${selectedCategory === cat ? ORANGE : "transparent"}`,
                      borderRadius: "200px", padding: "clamp(7px, 0.65vw, 10px) clamp(14px, 1.4vw, 22px)",
                      fontFamily: GEIST, fontWeight: 400, fontSize: "clamp(11px, 1.04vw, 15px)",
                      lineHeight: "1", letterSpacing: "-0.02em",
                      color: selectedCategory === cat ? "#ffffff" : "#929292",
                      cursor: "pointer", transition: "color 0.15s, border-color 0.15s",
                    }}>{cat}</button>
                  ))}
                </div>
              </div>

              {/* Sign In */}
              <button type="submit" disabled={loading} style={{
                width: "100%", background: ORANGE, border: "none", borderRadius: "140px",
                padding: "clamp(12px, 1.15vw, 17px) 0", fontFamily: GEIST, fontWeight: 600,
                fontSize: "clamp(13px, 1.2vw, 17.3px)", lineHeight: "0.9", letterSpacing: "-0.03em",
                color: "#ffffff", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
                marginTop: "clamp(8px, 0.8vw, 12px)", marginBottom: "clamp(16px, 1.8vw, 26px)",
              }}>
                {loading ? "Sending code..." : "Sign In"}
              </button>

              <div style={{ height: "1px", background: "rgba(255,255,255,0.15)", width: "100%" }} />
            </form>
          )}

          {/* ── OTP STEP ───────────────────────────────────────────────── */}
          {step === "otp" && (
            <div style={{ width: "100%", maxWidth: "clamp(300px, 36vw, 510px)" }}>
              {/* Logo */}
              <div style={{ marginBottom: "clamp(16px, 2vw, 28px)" }}>
                <Image src="/logo.png" alt="Linkaro" width={187} height={93}
                  style={{ width: "clamp(120px, 13vw, 187px)", height: "auto" }} priority />
              </div>

              {/* Back button */}
              <button type="button" onClick={() => { setStep("login"); clearInterval(timerRef.current); }} style={{
                width: 42, height: 42, borderRadius: "50%", background: "#26334B",
                border: "none", cursor: "pointer", display: "flex", alignItems: "center",
                justifyContent: "center", marginBottom: "clamp(24px, 3vw, 40px)",
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8L10 4" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Title */}
              <h1 style={{
                fontFamily: PP_MORI, fontWeight: 600, fontSize: "clamp(22px, 2.36vw, 34px)",
                lineHeight: "clamp(22px, 2.01vw, 29px)", letterSpacing: "-0.02em",
                color: "#ffffff", margin: "0 0 clamp(6px, 0.7vw, 10px) 0",
              }}>Verification</h1>

              {/* Subtitle */}
              <p style={{
                fontFamily: GEIST, fontWeight: 400, fontSize: "clamp(12px, 1.1vw, 16px)",
                lineHeight: "1.5", letterSpacing: "0.02em",
                color: "rgba(255,255,255,0.85)", margin: "0 0 clamp(28px, 3vw, 44px) 0",
              }}>
                {"We've sent the code to your email -"}<br />
                <span style={{ color: "#ffffff", fontWeight: 500 }}>{email}</span>
              </p>

              {/* OTP boxes */}
              <div style={{ display: "flex", gap: "clamp(8px, 1.2vw, 16px)", marginBottom: hasOtpError ? "clamp(6px, 0.6vw, 10px)" : "clamp(20px, 2.2vw, 32px)" }}
                onPaste={handleOtpPaste}>
                {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otpDigits[i]}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    style={{
                      width: "clamp(48px, 4.5vw, 64px)",
                      height: "clamp(48px, 4.5vw, 64px)",
                      flexShrink: 0,
                      textAlign: "center",
                      background: INPUT_BG,
                      border: `1.5px solid ${hasOtpError ? ERROR_COLOR : otpDigits[i] ? ORANGE : "transparent"}`,
                      borderRadius: "50%",
                      color: "#ffffff",
                      fontFamily: GEIST,
                      fontWeight: 700,
                      fontSize: "clamp(16px, 1.6vw, 22px)",
                      outline: "none",
                      caretColor: "transparent",
                      padding: 0,
                    }}
                  />
                ))}
              </div>

              {/* Error message */}
              {hasOtpError && (
                <p style={{ fontFamily: GEIST, fontWeight: 400, fontSize: "clamp(11px, 0.9vw, 14px)", color: ERROR_COLOR, margin: "0 0 clamp(16px, 1.8vw, 26px) 0" }}>
                  {otpErrorMsg}
                </p>
              )}

              {/* Timer */}
              <div style={{ textAlign: "center", marginBottom: "clamp(6px, 0.7vw, 10px)" }}>
                <span style={{ fontFamily: GEIST, fontWeight: 700, fontSize: "clamp(12px, 1vw, 14px)", color: "#ffffff" }}>
                  {formatTimer(timer)}
                </span>
              </div>

              {/* Resend */}
              <div style={{ textAlign: "center", marginBottom: "clamp(32px, 4vw, 56px)" }}>
                <span style={{ fontFamily: GEIST, fontWeight: 400, fontSize: "clamp(12px, 1.1vw, 16px)", color: "#ffffff" }}>
                  {"Didn't receive code? "}
                </span>
                <button type="button" onClick={handleResend} disabled={timer > 0 || loading} style={{
                  background: "none", border: "none", cursor: timer > 0 ? "default" : "pointer",
                  fontFamily: GEIST, fontWeight: 700, fontSize: "clamp(12px, 1.1vw, 16px)",
                  color: "#ffffff", opacity: timer > 0 ? 0.38 : 1, padding: 0,
                }}>
                  Resend Code
                </button>
              </div>

              {/* Verify button */}
              <button type="button" onClick={handleVerify} disabled={!isVerifyEnabled} style={{
                width: "100%", background: ORANGE, border: "none", borderRadius: "140px",
                padding: "clamp(12px, 1.15vw, 17px) 0", fontFamily: GEIST, fontWeight: 600,
                fontSize: "clamp(13px, 1.2vw, 17.3px)", lineHeight: "0.9", letterSpacing: "-0.03em",
                color: "#ffffff", cursor: isVerifyEnabled ? "pointer" : "not-allowed",
                opacity: isVerifyEnabled ? 1 : 0.45,
              }}>
                {verifying ? "Verifying..." : "Verify"}
              </button>

              <div style={{ height: "1px", background: "rgba(255,255,255,0.15)", width: "100%", marginTop: "clamp(16px, 1.8vw, 26px)" }} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
