import { useState, useRef, useEffect, useCallback } from "react";
import Head from "next/head";
import Sidebar from "@/components/Sidebar";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/authContext";

const SIDEBAR_W = 260;
const COLLAPSED_W = 56;
const ORANGE = "#FE5900";
const GEIST = "'Geist', sans-serif";
const PP_MORI = "'PP Mori', sans-serif";
const OTP_LENGTH = 6;
const OTP_TIMER_START = 90;

function HamburgerLines() {
  return (
    <>
      <span style={{ display: "block", width: 20, height: 2, background: "#fff", borderRadius: 1 }} />
      <span style={{ display: "block", width: 20, height: 2, background: "#fff", borderRadius: 1 }} />
      <span style={{ display: "block", width: 20, height: 2, background: "#fff", borderRadius: 1 }} />
    </>
  );
}

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div style={{ position: "fixed", top: 20, right: 24, zIndex: 3000, background: type === "success" ? "#14CA74" : "#FF4D4D", color: "#fff", padding: "12px 20px", borderRadius: 10, fontFamily: GEIST, fontSize: 13, fontWeight: 500, boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}>
      {message}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: "clamp(16px, 1.6vw, 24px)" }}>
      <label style={{ fontFamily: GEIST, fontWeight: 500, fontSize: "clamp(10px, 0.83vw, 12px)", color: "rgba(255,255,255,0.55)", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 10,
  padding: "clamp(10px, 1vw, 14px) clamp(14px, 1.2vw, 18px)",
  color: "#ffffff",
  fontFamily: GEIST,
  fontWeight: 400,
  fontSize: "clamp(13px, 1.1vw, 15px)",
  outline: "none",
  transition: "border-color 0.15s",
};

function PasswordInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ ...inputStyle, paddingRight: 48 }}
        onFocus={(e) => { e.target.style.borderColor = "rgba(254,89,0,0.5)"; }}
        onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; }}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}
      >
        <img src={show ? "/eye-hide.ico" : "/eye.png"} alt="" style={{ width: 18, height: 18, objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.5 }} />
      </button>
    </div>
  );
}

// OTP overlay — same circle design as the login screen
function OtpOverlay({ email, onVerified, onCancel }) {
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [pendingOtp, setPendingOtp] = useState(null);
  const [timer, setTimer] = useState(OTP_TIMER_START);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);

  const sendOtp = useCallback(async () => {
    setSending(true);
    setError("");
    try {
      const res = await apiFetch("/admin/send-profile-otp", { method: "POST" });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Failed to send OTP."); return; }
      setPendingOtp(data.otp);
      setDigits(Array(OTP_LENGTH).fill(""));
      setTimer(OTP_TIMER_START);
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  }, []);

  // Send OTP on mount
  useEffect(() => { sendOtp(); }, [sendOtp]);

  // Countdown
  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  function handleDigit(idx, val) {
    const char = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[idx] = char;
    setDigits(next);
    setError("");
    if (char && idx < OTP_LENGTH - 1) inputRefs.current[idx + 1]?.focus();
  }

  function handleKeyDown(idx, e) {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    [...pasted].forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  }

  async function handleVerify() {
    const code = digits.join("");
    if (code.length < OTP_LENGTH) { setError("Please enter all 6 digits."); return; }
    if (code !== pendingOtp) { setError("Incorrect code. Please try again."); return; }
    setVerifying(true);
    onVerified();
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "#000F2C", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 18, padding: "clamp(24px, 2.5vw, 36px)", width: "100%", maxWidth: 400, textAlign: "center" }}>
        {/* Icon */}
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(254,89,0,0.12)", border: "1px solid rgba(254,89,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="6" width="20" height="14" rx="2" stroke={ORANGE} strokeWidth="1.8" />
            <path d="M2 10l10 6 10-6" stroke={ORANGE} strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>

        <h2 style={{ fontFamily: PP_MORI, fontWeight: 600, fontSize: "clamp(18px, 1.6vw, 22px)", color: "#ffffff", margin: "0 0 8px 0" }}>
          Verify your identity
        </h2>
        <p style={{ fontFamily: GEIST, fontSize: "clamp(12px, 1vw, 14px)", color: "rgba(255,255,255,0.5)", margin: "0 0 28px 0", lineHeight: 1.5 }}>
          We sent a 6-digit code to<br />
          <span style={{ color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>{email}</span>
        </p>

        {/* OTP boxes */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 20 }}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleDigit(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              style={{
                width: 44,
                height: 44,
                flexShrink: 0,
                borderRadius: "50%",
                border: `2px solid ${d ? ORANGE : "rgba(255,255,255,0.2)"}`,
                background: d ? "rgba(254,89,0,0.1)" : "rgba(255,255,255,0.05)",
                color: "#ffffff",
                fontFamily: GEIST,
                fontWeight: 700,
                fontSize: 20,
                textAlign: "center",
                outline: "none",
                padding: 0,
                transition: "border-color 0.15s, background 0.15s",
              }}
            />
          ))}
        </div>

        {/* Error */}
        {error && (
          <p style={{ fontFamily: GEIST, fontSize: 13, color: "#FF4D4D", margin: "0 0 16px 0" }}>{error}</p>
        )}

        {/* Timer / Resend */}
        <div style={{ fontFamily: GEIST, fontSize: "clamp(11px, 0.9vw, 13px)", color: "rgba(255,255,255,0.45)", marginBottom: 24 }}>
          {timer > 0 ? (
            <>Resend in <span style={{ color: ORANGE, fontWeight: 600 }}>{timer}s</span></>
          ) : (
            <button
              type="button"
              onClick={sendOtp}
              disabled={sending}
              style={{ background: "none", border: "none", cursor: sending ? "not-allowed" : "pointer", color: ORANGE, fontFamily: GEIST, fontSize: "clamp(11px, 0.9vw, 13px)", fontWeight: 600, padding: 0 }}
            >
              {sending ? "Sending…" : "Resend code"}
            </button>
          )}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            onClick={onCancel}
            style={{ flex: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "clamp(11px, 1vw, 14px)", fontFamily: GEIST, fontWeight: 600, fontSize: "clamp(13px, 1.1vw, 15px)", color: "#ffffff", cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleVerify}
            disabled={verifying || digits.join("").length < OTP_LENGTH}
            style={{ flex: 1, background: ORANGE, border: "none", borderRadius: 10, padding: "clamp(11px, 1vw, 14px)", fontFamily: GEIST, fontWeight: 600, fontSize: "clamp(13px, 1.1vw, 15px)", color: "#ffffff", cursor: verifying || digits.join("").length < OTP_LENGTH ? "not-allowed" : "pointer", opacity: digits.join("").length < OTP_LENGTH ? 0.5 : 1, transition: "opacity 0.15s" }}
          >
            {verifying ? "Verifying…" : "Verify"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProfileSettings() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { name: ctxName, profileImage: ctxImage, setName: setCtxName, setProfileImage: setCtxImage } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [showOtp, setShowOtp] = useState(false);
  const [pendingBody, setPendingBody] = useState(null);
  const fileRef = useRef();

  useEffect(() => { if (ctxName) setName(ctxName); }, [ctxName]);
  useEffect(() => { if (ctxImage) setPreviewImage(ctxImage); }, [ctxImage]);

  useEffect(() => {
    apiFetch("/auth/me")
      .then((r) => r.json())
      .then((d) => { if (d.success) setEmail(d.email || ""); });
  }, []);

  function handleImageSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setPreviewImage(reader.result); setImageBase64(reader.result); };
    reader.readAsDataURL(file);
  }

  async function submitUpdate(body) {
    setSaving(true);
    try {
      const res = await apiFetch("/admin/update-profile", { method: "POST", body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { setToast({ message: data.message || "Update failed.", type: "error" }); return; }
      if (data.name) setCtxName(data.name);
      if (data.profileImage !== undefined) setCtxImage(data.profileImage);
      setImageBase64(null);
      setNewPassword("");
      setConfirmPassword("");
      setToast({ message: "Profile updated successfully.", type: "success" });
    } catch {
      setToast({ message: "Network error. Please try again.", type: "error" });
    } finally {
      setSaving(false);
    }
  }

  function handleSave(e) {
    e.preventDefault();
    const body = {};
    if (name.trim()) body.name = name.trim();
    if (email.trim()) body.email = email.trim();
    if (imageBase64) body.profileImage = imageBase64;

    if (newPassword) {
      if (newPassword.length < 6) { setToast({ message: "Password must be at least 6 characters.", type: "error" }); return; }
      if (newPassword !== confirmPassword) { setToast({ message: "Passwords do not match.", type: "error" }); return; }
      body.password = newPassword;
    }

    if (Object.keys(body).length === 0) { setToast({ message: "Nothing to update.", type: "error" }); return; }

    if (body.password) {
      // Password change requires OTP verification first
      setPendingBody(body);
      setShowOtp(true);
    } else {
      submitUpdate(body);
    }
  }

  function handleOtpVerified() {
    setShowOtp(false);
    submitUpdate(pendingBody);
    setPendingBody(null);
  }

  function handleOtpCancel() {
    setShowOtp(false);
    setPendingBody(null);
  }

  return (
    <>
      <Head><title>Account Settings — Linkaro</title></Head>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {showOtp && (
        <OtpOverlay
          email={email}
          onVerified={handleOtpVerified}
          onCancel={handleOtpCancel}
        />
      )}

      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />

      {!sidebarOpen && (
        <div className="sidebar-collapsed-strip" style={{ position: "fixed", top: 0, left: 0, height: "100vh", width: COLLAPSED_W, background: "#000F2C", borderRight: "1px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 18, zIndex: 99 }}>
          <button type="button" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar" style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 6px", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <HamburgerLines />
          </button>
        </div>
      )}

      {!sidebarOpen && (
        <button className="mobile-hamburger" type="button" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar" style={{ position: "fixed", top: 16, left: 16, zIndex: 101, width: 40, height: 40, background: "#000F2C", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5 }}>
          <HamburgerLines />
        </button>
      )}

      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}

      <main
        className="dashboard-main"
        style={{ minHeight: "100vh", background: "#000F2C", marginLeft: sidebarOpen ? SIDEBAR_W : COLLAPSED_W, transition: "margin-left 0.3s ease", padding: "clamp(24px, 3vw, 48px)", color: "#ffffff" }}
      >
        <div style={{ marginBottom: "clamp(24px, 2.5vw, 40px)" }}>
          <h1 style={{ fontFamily: PP_MORI, fontWeight: 600, fontSize: "clamp(20px, 1.8vw, 26px)", letterSpacing: "-0.02em", color: "#ffffff", margin: "0 0 6px 0" }}>
            Account Settings
          </h1>
          <p style={{ fontFamily: GEIST, fontWeight: 400, fontSize: "clamp(12px, 1vw, 14px)", color: "rgba(255,255,255,0.45)", margin: 0 }}>
            Update your profile photo, name, email and password.
          </p>
        </div>

        <form onSubmit={handleSave} noValidate style={{ maxWidth: 600 }}>

          {/* Profile photo */}
          <div style={{ marginBottom: "clamp(28px, 2.5vw, 40px)", display: "flex", alignItems: "center", gap: "clamp(20px, 2vw, 32px)" }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{ width: "clamp(80px, 7vw, 100px)", height: "clamp(80px, 7vw, 100px)", borderRadius: "50%", overflow: "hidden", background: "rgba(255,255,255,0.08)", border: `2px solid ${previewImage ? ORANGE : "rgba(255,255,255,0.15)"}` }}>
                {previewImage ? (
                  <img src={previewImage} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} referrerPolicy="no-referrer" />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="8" r="4" fill="rgba(255,255,255,0.3)" />
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                )}
              </div>
              <button type="button" onClick={() => fileRef.current.click()} style={{ position: "absolute", bottom: 0, right: 0, width: 28, height: 28, borderRadius: "50%", background: ORANGE, border: "2px solid #000F2C", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="13" r="4" stroke="#fff" strokeWidth="2" />
                </svg>
              </button>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageSelect} />
            </div>
            <div>
              <p style={{ fontFamily: GEIST, fontWeight: 500, fontSize: "clamp(13px, 1.1vw, 15px)", color: "#ffffff", margin: "0 0 4px 0" }}>Profile Photo</p>
              <p style={{ fontFamily: GEIST, fontWeight: 400, fontSize: "clamp(11px, 0.9vw, 13px)", color: "rgba(255,255,255,0.4)", margin: "0 0 12px 0" }}>JPG, PNG or GIF · Max 5 MB</p>
              <button type="button" onClick={() => fileRef.current.click()} style={{ fontFamily: GEIST, fontWeight: 500, fontSize: "clamp(11px, 0.9vw, 13px)", color: ORANGE, background: "rgba(254,89,0,0.1)", border: "1px solid rgba(254,89,0,0.3)", borderRadius: 8, padding: "6px 14px", cursor: "pointer" }}>
                Choose photo
              </button>
            </div>
          </div>

          {/* Form card */}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "clamp(20px, 2vw, 32px)" }}>

            <Field label="Full Name">
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" style={inputStyle} onFocus={(e) => { e.target.style.borderColor = "rgba(254,89,0,0.5)"; }} onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; }} />
            </Field>

            <Field label="Email Address">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" style={inputStyle} onFocus={(e) => { e.target.style.borderColor = "rgba(254,89,0,0.5)"; }} onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; }} />
            </Field>

            <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "clamp(16px, 1.5vw, 24px) 0" }} />

            <Field label="New Password">
              <PasswordInput value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Leave blank to keep current password" />
              <p style={{ fontFamily: GEIST, fontSize: "clamp(10px, 0.8vw, 12px)", color: "rgba(255,255,255,0.3)", margin: "6px 0 0 4px" }}>Minimum 6 characters</p>
            </Field>

            <Field label="Confirm Password">
              <PasswordInput value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter new password" />
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <p style={{ fontFamily: GEIST, fontSize: "clamp(10px, 0.8vw, 12px)", color: "#FF4D4D", margin: "6px 0 0 4px" }}>Passwords do not match</p>
              )}
            </Field>
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{ marginTop: "clamp(20px, 2vw, 28px)", background: ORANGE, border: "none", borderRadius: 10, padding: "clamp(12px, 1.1vw, 16px) clamp(32px, 3vw, 48px)", fontFamily: GEIST, fontWeight: 600, fontSize: "clamp(13px, 1.1vw, 15px)", color: "#ffffff", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, transition: "opacity 0.15s" }}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </main>
    </>
  );
}
