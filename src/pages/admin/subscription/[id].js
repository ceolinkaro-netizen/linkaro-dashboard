import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Sidebar from "@/components/Sidebar";

const SIDEBAR_W = 260;
const COLLAPSED_W = 56;
const ORANGE = "#FE5900";
const GEIST = "'Geist', sans-serif";
const PP_MORI = "'PP Mori', sans-serif";

function HamburgerLines() {
  return (
    <>
      <span
        style={{
          display: "block",
          width: 20,
          height: 2,
          background: "#fff",
          borderRadius: 1,
        }}
      />
      <span
        style={{
          display: "block",
          width: 20,
          height: 2,
          background: "#fff",
          borderRadius: 1,
        }}
      />
      <span
        style={{
          display: "block",
          width: 20,
          height: 2,
          background: "#fff",
          borderRadius: 1,
        }}
      />
    </>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ marginBottom: "clamp(4px, 0.4vw, 6px)" }}>
      <span
        style={{
          fontFamily: PP_MORI,
          fontWeight: 600,
          fontSize: "clamp(12px, 1.1vw, 16px)",
          lineHeight: "26px",
          letterSpacing: "-0.02em",
          color: "#ffffff",
        }}
      >
        {label}:{" "}
      </span>
      <span
        style={{
          fontFamily: PP_MORI,
          fontWeight: 400,
          fontSize: "clamp(12px, 1.1vw, 16px)",
          lineHeight: "26px",
          letterSpacing: "-0.02em",
          color: "#ffffff",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function SectionHeader({ children }) {
  return (
    <h2
      style={{
        fontFamily: GEIST,
        fontWeight: 500,
        fontSize: "clamp(13px, 1.1vw, 16px)",
        lineHeight: "18px",
        letterSpacing: "0",
        color: "#ffffff",
        margin: "0 0 clamp(10px, 1vw, 14px) 0",
      }}
    >
      {children}
    </h2>
  );
}

const btnBase = {
  borderRadius: 50,
  fontFamily: GEIST,
  fontWeight: 400,
  fontSize: "clamp(10px, 0.83vw, 12px)",
  lineHeight: "14px",
  letterSpacing: "0",
  color: "#ffffff",
  cursor: "pointer",
  whiteSpace: "nowrap",
};

export default function SubscriptionTicketDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  async function updateStatus(status) {
    if (updating) return;
    setUpdating(true);
    try {
      const res = await fetch("/api/admin/update-subscription-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) {
        setItem((prev) => {
          const isBadge = (prev.subscriptionType || "").toLowerCase().includes("badge");
          const userStatusField = isBadge ? "badgeSubscriptionStatus" : "subscriptionStatus";
          return {
            ...prev,
            status,
            user: { ...prev.user, [userStatusField]: status },
          };
        });
      }
    } finally {
      setUpdating(false);
    }
  }

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/get-subscription?id=${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setItem(data.subscription);
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <>
      <Head>
        <title>Subscription Ticket Details — Linkaro</title>
      </Head>

      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
      />

      {!sidebarOpen && (
        <div
          className="sidebar-collapsed-strip"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            width: COLLAPSED_W,
            background: "#000F2C",
            borderRight: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 18,
            zIndex: 99,
          }}
        >
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px 6px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 5,
            }}
          >
            <HamburgerLines />
          </button>
        </div>
      )}

      {!sidebarOpen && (
        <button
          className="mobile-hamburger"
          type="button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
          style={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 101,
            width: 40,
            height: 40,
            background: "#000F2C",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 8,
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
          }}
        >
          <HamburgerLines />
        </button>
      )}

      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main
        className="dashboard-main"
        style={{
          minHeight: "100vh",
          background: "#000F2C",
          marginLeft: sidebarOpen ? SIDEBAR_W : COLLAPSED_W,
          transition: "margin-left 0.3s ease",
          padding: "clamp(20px, 2.5vw, 40px)",
          color: "#ffffff",
        }}
      >
        {loading ? (
          <p style={{ fontFamily: GEIST, color: "rgba(255,255,255,0.5)" }}>
            Loading…
          </p>
        ) : !item ? (
          <p style={{ fontFamily: GEIST, color: "rgba(255,255,255,0.5)" }}>
            Ticket not found.
          </p>
        ) : (
          <>
            {/* Page header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "clamp(14px, 1.4vw, 20px)",
                flexWrap: "wrap",
                gap: "clamp(10px, 1vw, 14px)",
              }}
            >
              <h1
                style={{
                  fontFamily: PP_MORI,
                  fontWeight: 600,
                  fontSize: "clamp(18px, 1.67vw, 24px)",
                  lineHeight: "29px",
                  letterSpacing: "-0.02em",
                  color: "#ffffff",
                  margin: 0,
                }}
              >
                Subscription Ticket Details
              </h1>
              <div style={{ display: "flex", gap: "clamp(8px, 0.8vw, 12px)" }}>
                <button
                  type="button"
                  onClick={() => updateStatus("rejected")}
                  disabled={updating}
                  style={{
                    ...btnBase,
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.6)",
                    padding: "clamp(7px, 0.65vw, 10px) clamp(16px, 1.5vw, 24px)",
                    opacity: updating ? 0.6 : 1,
                  }}
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => updateStatus("active")}
                  disabled={updating}
                  style={{
                    ...btnBase,
                    background: ORANGE,
                    border: "none",
                    padding: "clamp(7px, 0.65vw, 10px) clamp(16px, 1.5vw, 24px)",
                    opacity: updating ? 0.6 : 1,
                  }}
                >
                  Approve
                </button>
              </div>
            </div>

            {/* Divider below header */}
            <div
              style={{
                height: 1,
                background: "rgba(255,255,255,0.1)",
                marginBottom: "clamp(16px, 1.6vw, 24px)",
              }}
            />

            {/* Two-column grid */}
            <div className="ticket-detail-grid">
              {/* Left: single card with both sections */}
              <div
                style={{
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  padding: "clamp(16px, 1.5vw, 24px)",
                }}
              >
                <SectionHeader>User Information</SectionHeader>
                <InfoRow label="Name" value={item.user?.name || "—"} />
                <InfoRow label="User Type" value={item.user?.role || "—"} />
                <InfoRow label="Service Category" value={item.user?.category || "—"} />
                <InfoRow label="Phone" value={item.user?.phone || "—"} />
                <InfoRow label="Email" value={item.user?.email || "—"} />
                <InfoRow
                  label="Location"
                  value={
                    item.user?.address
                      ? [item.user.address.street, item.user.address.city, item.user.address.zip]
                          .filter(Boolean)
                          .join(", ") || "—"
                      : "—"
                  }
                />

                <div style={{ height: "clamp(14px, 1.3vw, 20px)" }} />

                <SectionHeader>Subscription Info</SectionHeader>
                <InfoRow label="Subscription Plan" value={item.subscriptionType || "—"} />
                <InfoRow label="Amount Paid" value={item.amountPaid || "—"} />
                <InfoRow label="Payment Method" value={item.paymentOption || "—"} />
                <InfoRow label="Date Submitted" value={item.subscriptionDate ? new Date(item.subscriptionDate).toLocaleDateString() : "—"} />
                <InfoRow
                  label="Ticket Status"
                  value={
                    (item.subscriptionType || "").toLowerCase().includes("badge")
                      ? (item.user?.badgeSubscriptionStatus || "—")
                      : (item.user?.subscriptionStatus || "—")
                  }
                />
                <InfoRow label="Priority" value="High" />
              </div>

              {/* Right: Payment Proof */}
              <div
                style={{
                  background: "rgba(255,255,255,0.13)",
                  borderRadius: 12,
                  padding: "clamp(16px, 1.5vw, 24px)",
                }}
              >
                <SectionHeader>Payment Proof</SectionHeader>

                <div
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    borderRadius: 16,
                    padding: "clamp(20px, 2vw, 32px)",
                    marginBottom: "clamp(14px, 1.3vw, 20px)",
                  }}
                >
                  {item.receiptImage ? (
                    <img
                      src={item.receiptImage}
                      alt="Receipt"
                      style={{
                        width: "100%",
                        maxWidth: "100%",
                        maxHeight: "320px",
                        borderRadius: 12,
                        display: "block",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        background: "#6F6F6F",
                        borderRadius: 12,
                        aspectRatio: "2 / 1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      <img
                        src="/gallery-icon.png"
                        alt="No receipt"
                        style={{ width: 20, height: 18, objectFit: "contain" }}
                      />
                    </div>
                  )}
                </div>

                {/* Download + view full size — centered */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "clamp(8px, 0.8vw, 12px)",
                  }}
                >
                  <a
                    href={item.receiptImage || "#"}
                    download="receipt"
                    style={{
                      ...btnBase,
                      background: item.receiptImage ? ORANGE : "rgba(255,255,255,0.2)",
                      border: "none",
                      padding: "clamp(9px, 0.85vw, 13px) clamp(20px, 2vw, 32px)",
                      textDecoration: "none",
                      display: "inline-block",
                      pointerEvents: item.receiptImage ? "auto" : "none",
                    }}
                  >
                    Download Image
                  </a>
                  {item.receiptImage && (
                    <span
                      onClick={() => window.open(item.receiptImage, "_blank")}
                      style={{
                        fontFamily: GEIST,
                        fontWeight: 400,
                        fontSize: "clamp(10px, 0.83vw, 12px)",
                        lineHeight: "14px",
                        color: "rgba(255,255,255,0.5)",
                        cursor: "pointer",
                      }}
                    >
                      view full size
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom action buttons — right aligned, no divider */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "clamp(8px, 0.8vw, 12px)",
                flexWrap: "wrap",
                marginTop: "clamp(20px, 2vw, 32px)",
              }}
            >
              <button
                type="button"
                onClick={() => updateStatus("fraud")}
                disabled={updating}
                style={{
                  ...btnBase,
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.6)",
                  padding: "clamp(10px, 0.95vw, 14px) clamp(18px, 1.8vw, 28px)",
                  opacity: updating ? 0.6 : 1,
                }}
              >
                Mark as Fraud
              </button>
              <button
                type="button"
                onClick={() => updateStatus("active")}
                disabled={updating}
                style={{
                  ...btnBase,
                  background: ORANGE,
                  border: "none",
                  padding: "clamp(10px, 0.95vw, 14px) clamp(18px, 1.8vw, 28px)",
                  opacity: updating ? 0.6 : 1,
                }}
              >
                Approve &amp; Activate Subscription
              </button>
              <button
                type="button"
                onClick={() => updateStatus("rejected")}
                disabled={updating}
                style={{
                  ...btnBase,
                  background: "#B6280C",
                  border: "none",
                  padding: "clamp(10px, 0.95vw, 14px) clamp(18px, 1.8vw, 28px)",
                  opacity: updating ? 0.6 : 1,
                }}
              >
                Reject Ticket
              </button>
            </div>
          </>
        )}
      </main>
    </>
  );
}
