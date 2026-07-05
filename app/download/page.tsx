"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthGuard from "@/components/AuthGuard";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

type Stats = {
  totalDownloads: number;
  iosCount: number;
  androidCount: number;
  uniqueUsers: number;
};

export default function DownloadPage() {
  const { data: session } = useSession();
  const [tracked, setTracked] = useState<string | null>(null);
  const [alreadyDownloaded, setAlreadyDownloaded] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/downloads")
      .then((r) => r.json())
      .then((data) => {
        const downloads = data.downloads ?? [];
        const iosCount = downloads.filter((d: any) => d.platform === "ios").length;
        const androidCount = downloads.filter((d: any) => d.platform === "android").length;
        
        const uniqueUserIds = new Set(downloads.filter((d: any) => d.userId).map((d: any) => d.userId));
        
        setStats({
          totalDownloads: downloads.length,
          iosCount,
          androidCount,
          uniqueUsers: uniqueUserIds.size,
        });
        setLoading(false);
      })
      .catch(() => {
        setStats({
          totalDownloads: 0,
          iosCount: 0,
          androidCount: 0,
          uniqueUsers: 0,
        });
        setLoading(false);
      });
  }, []);

  async function trackDownload(platform: "ios" | "android") {
    setTracked(platform);
    try {
      const res = await fetch("/api/downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          userId: (session?.user as any)?.id,
        }),
      });

      const data = await res.json();
      
      if (data.alreadyTracked) {
        setAlreadyDownloaded(platform);
      } else {
        setAlreadyDownloaded(null);
        // Refresh stats after new download
        const statsRes = await fetch("/api/downloads");
        const statsData = await statsRes.json();
        const downloads = statsData.downloads ?? [];
        const iosCount = downloads.filter((d: any) => d.platform === "ios").length;
        const androidCount = downloads.filter((d: any) => d.platform === "android").length;
        const uniqueUserIds = new Set(downloads.filter((d: any) => d.userId).map((d: any) => d.userId));
        setStats({
          totalDownloads: downloads.length,
          iosCount,
          androidCount,
          uniqueUsers: uniqueUserIds.size,
        });
      }
    } catch (err) {
      console.error("Track download failed:", err);
    }
  }

  function getButtonState(platform: "ios" | "android") {
    if (tracked === platform) {
      if (alreadyDownloaded === platform) {
        return { text: "✓ Already downloaded", disabled: true };
      }
      return { text: "✓ Opening Store…", disabled: true };
    }
    return { text: platform === "ios" ? "↓ App Store" : "↓ Google Play", disabled: false };
  }

  const displayStats = [
    { num: loading ? "..." : (stats?.totalDownloads ?? 0).toLocaleString(), label: "Total downloads" },
    { num: loading ? "..." : (stats?.uniqueUsers ?? 0).toLocaleString(), label: "Active users" },
    { num: loading ? "..." : (stats?.iosCount ?? 0).toLocaleString(), label: "iOS downloads" },
    { num: loading ? "..." : (stats?.androidCount ?? 0).toLocaleString(), label: "Android downloads" },
  ];

  return (
    <AuthGuard>
      <Navbar />

      <main className="download-page">
        <div className="container">

          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <p className="section-label">Download</p>
            <h1 className="page-hero-title">
              Get Yalla on<br /><span style={{ color: "var(--yellow)" }}>your phone</span>
            </h1>
           
          </div>

          <div className="download-hero">
            <div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, marginBottom: 16 }}>
                Three steps to your first ride
              </h2>
              <div className="download-steps">
                {[
                  { n: "1", title: "Download the app", desc: "Free on iOS and Android. Under 50 MB." },
                  { n: "2", title: "Create your account", desc: "Sign up with Google or your email in under a minute." },
                  { n: "3", title: "Book your first ride", desc: "Set pickup, choose your ride type, and go." },
                ].map((s) => (
                  <div key={s.n} className="download-step">
                    <div className="download-step-num">{s.n}</div>
                    <div className="download-step-text">
                      <h4>{s.title}</h4>
                      <p>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="platform-cards">
              {/* iOS card */}
              <div className="platform-card">
                <div className="platform-card-icon">
                  <svg width="270" height="80" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </div>
                <div className="platform-card-name">iOS</div>
                <div className="platform-card-sub">iPhone 12 or later · iOS 15+</div>
                {tracked === "ios" && alreadyDownloaded === "ios" ? (
                  <div className="form-success" style={{ margin: 0, textAlign: "center" }}>
                    ✓ Already downloaded
                  </div>
                ) : (
                  <button
                    className="btn-download"
                    onClick={() => trackDownload("ios")}
                    disabled={getButtonState("ios").disabled}
                    style={{
                      opacity: getButtonState("ios").disabled ? 0.5 : 1,
                      cursor: getButtonState("ios").disabled ? "not-allowed" : "pointer",
                    }}
                  >
                    <span>{getButtonState("ios").text}</span>
                  </button>
                )}
              </div>

              {/* Android card */}
              <div className="platform-card">
                <div className="platform-card-icon">
                  <svg width="270" height="80" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M3.18 23.76c.3.17.65.2.98.07l11.65-6.73-2.6-2.6-10.03 9.26z" fill="#EA4335"/>
                    <path d="M22.23 10.07l-2.98-1.72-2.93 2.65 2.93 2.93 2.98-1.72c.85-.49.85-1.65 0-2.14z" fill="#FBBC05"/>
                    <path d="M1.27.76C1.1 1.02 1 1.34 1 1.72v20.56c0 .38.1.7.27.96l10.03-9.26L1.27.76z" fill="#4285F4"/>
                    <path d="M13.81 12l2.6-2.6L4.16.67C3.83.5 3.47.53 3.18.7L13.81 12z" fill="#34A853"/>
                  </svg>
                </div>
                <div className="platform-card-name">Android</div>
                <div className="platform-card-sub">Android 9+ · 4.5 stars</div>
                {tracked === "android" && alreadyDownloaded === "android" ? (
                  <div className="form-success" style={{ margin: 0, textAlign: "center" }}>
                    ✓ Already downloaded
                  </div>
                ) : (
                  <button
                    className="btn-download"
                    onClick={() => trackDownload("android")}
                    disabled={getButtonState("android").disabled}
                    style={{
                      opacity: getButtonState("android").disabled ? 0.5 : 1,
                      cursor: getButtonState("android").disabled ? "not-allowed" : "pointer",
                    }}
                  >
                    <span>{getButtonState("android").text}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          
          <div className="download-stats-row">
            {displayStats.map((s) => (
              <div key={s.label} className="dl-stat">
                <div className="dl-stat-num">{s.num}</div>
                <div className="dl-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </AuthGuard>
  );
}