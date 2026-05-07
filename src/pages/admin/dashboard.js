import { useState } from "react";
import Head from "next/head";
import Sidebar from "@/components/Sidebar";

const SIDEBAR_W = 260;
const COLLAPSED_W = 56;

function Hamburger({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
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
      <span style={{ display: "block", width: 20, height: 2, background: "#ffffff", borderRadius: 1 }} />
      <span style={{ display: "block", width: 20, height: 2, background: "#ffffff", borderRadius: 1 }} />
      <span style={{ display: "block", width: 20, height: 2, background: "#ffffff", borderRadius: 1 }} />
    </button>
  );
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <Head>
        <title>Dashboard — Linkaro</title>
      </Head>

      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
      />

      {/* Collapsed strip — desktop: hamburger + full-height vertical divider */}
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
          <Hamburger onClick={() => setSidebarOpen(true)} />
        </div>
      )}

      {/* Mobile hamburger — floating, only visible on small screens */}
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
          <span style={{ display: "block", width: 18, height: 2, background: "#ffffff", borderRadius: 1 }} />
          <span style={{ display: "block", width: 18, height: 2, background: "#ffffff", borderRadius: 1 }} />
          <span style={{ display: "block", width: 18, height: 2, background: "#ffffff", borderRadius: 1 }} />
        </button>
      )}

      {/* Mobile backdrop */}
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
        <h1
          style={{
            fontFamily: "'PP Mori', sans-serif",
            fontWeight: 600,
            fontSize: "clamp(22px, 2.2vw, 32px)",
            color: "#ffffff",
            margin: 0,
          }}
        >
          Welcome Back, John
        </h1>
        <p
          style={{
            fontFamily: "'Geist', sans-serif",
            fontWeight: 400,
            fontSize: "clamp(13px, 1vw, 15px)",
            color: "rgba(255,255,255,0.6)",
            marginTop: 8,
          }}
        >
          Measure your advertising ROI and report website traffic.
        </p>
      </main>
    </>
  );
}
