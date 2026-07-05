"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";

type Stats = {
  totalDownloads: number;
  totalFeedback: number;
  totalUsers: number;
  avgRating: number;
  iosCount: number;
  androidCount: number;
  feedbackByCategory: { category: string; _count: { category: number } }[];
  weeklyDownloads: { week: string; count: number }[];
};

type FeedbackItem = {
  id: number;
  rating: number;
  category: string;
  message: string;
  userName?: string;
  userEmail?: string;
  createdAt: string;
};

const CATEGORY_COLORS: Record<string, string> = {
  "App experience": "var(--yellow)",
  "Driver behavior": "#4ade80",
  "Ride quality": "#60a5fa",
  "Pricing": "#c084fc",
  "Support": "#fb923c",
  "Other": "var(--gray-3)",
};

function DonutChart({ ios, android }: { ios: number; android: number }) {
  const total = ios + android || 1;
  const iosPct = Math.round((ios / total) * 100);
  const androidPct = 100 - iosPct;

  const platforms = [
    { name: "iOS", pct: iosPct, color: "#FFE600" },
    { name: "Android", pct: androidPct, color: "#4ade80" },
  ];

  const r = 60;
  const cx = 80;
  const cy = 80;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
      <svg width="160" height="160" viewBox="0 0 160 160">
        {platforms.map((p) => {
          const dash = (p.pct / 100) * circumference;
          const gap = circumference - dash;
          const el = (
            <circle
              key={p.name}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={p.color}
              strokeWidth="20"
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${cx} ${cy})`}
            />
          );
          offset += dash;
          return el;
        })}
        <text x={cx} y={cy - 6} textAnchor="middle" fill="white" fontSize="18" fontWeight="800">{total}</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="#999" fontSize="10">downloads</text>
      </svg>
      <div className="donut-legend">
        {platforms.map((p) => (
          <div key={p.name} className="donut-legend-item">
            <div className="donut-dot" style={{ background: p.color }} />
            <span>{p.name}</span>
            <span style={{ marginLeft: "auto", fontWeight: 700, color: p.color }}>{p.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [filteredFeedback, setFilteredFeedback] = useState<FeedbackItem[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/downloads").then((r) => r.json()),
      fetch("/api/feedback").then((r) => r.json()),
    ])
      .then(([downloadsData, feedbackData]) => {
        const downloads: any[] = downloadsData.downloads ?? [];
        const feedback: any[] = feedbackData.feedback ?? [];

        
        setFeedbackItems(feedback);

        
        const iosCount = downloads.filter((d) => d.platform === "ios").length;
        const androidCount = downloads.filter((d) => d.platform === "android").length;

       
        const avgRating = feedback.length
          ? feedback.reduce((s: number, f: any) => s + f.rating, 0) / feedback.length
          : 0;

        const categoryMap: Record<string, number> = {};
        feedback.forEach((f: any) => {
          categoryMap[f.category] = (categoryMap[f.category] || 0) + 1;
        });
        const feedbackByCategory = Object.entries(categoryMap).map(([category, count]) => ({
          category,
          _count: { category: count },
        }));

        const now = Date.now();
        const weeklyMap: Record<string, number> = {};
        for (let i = 7; i >= 0; i--) {
          weeklyMap[`W${8 - i}`] = 0;
        }
        downloads.forEach((d: any) => {
          const weeksAgo = Math.floor((now - new Date(d.createdAt).getTime()) / (7 * 24 * 60 * 60 * 1000));
          if (weeksAgo < 8) {
            const label = `W${8 - weeksAgo}`;
            weeklyMap[label] = (weeklyMap[label] || 0) + 1;
          }
        });
        const weeklyDownloads = Object.entries(weeklyMap).map(([week, count]) => ({ week, count }));

        setStats({
          totalDownloads: downloads.length,
          totalFeedback: feedback.length,
          totalUsers: 0,
          avgRating,
          iosCount,
          androidCount,
          feedbackByCategory,
          weeklyDownloads,
        });
        setLoading(false);
        setTimeout(() => setLoaded(true), 200);
      })
      .catch(() => setLoading(false));
  }, []);

  const maxWeekly = stats ? Math.max(...stats.weeklyDownloads.map((d) => d.count), 1) : 1;

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    const filtered = feedbackItems.filter((f) => f.category === category);
    setFilteredFeedback(filtered);
    setShowModal(true);
  };

  
  const closeModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
    setFilteredFeedback([]);
  };

  return (
    <>
      <Navbar />

      <main className="analytics-page">
        <div className="container">

          <div className="analytics-header">
            <p className="section-label">Analytics</p>
            <h1>Platform overview</h1>
            <p>Real-time metrics from your database.</p>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--gray-3)" }}>
              Loading analytics…
            </div>
          ) : stats && (
            <>
              <div className="analytics-kpi-grid">
                {[
                  { label: "Total downloads",      value: stats.totalDownloads.toLocaleString(), up: true,  change: "" },
                  { label: "iOS downloads",         value: stats.iosCount.toLocaleString(),       up: true,  change: "" },
                  { label: "Android downloads",     value: stats.androidCount.toLocaleString(),   up: true,  change: "" },
                  { label: "Avg feedback rating",   value: `${stats.avgRating.toFixed(1)}★`,      up: true,  change: "" },
                  { label: "Feedback submissions",  value: stats.totalFeedback.toLocaleString(),  up: true,  change: "" },
                  { label: "5-star feedback",       value: feedbackItems.filter(f => f.rating === 5).length.toLocaleString(), up: true,  change: "" },
                ].map((k) => (
                  <div key={k.label} className="kpi-card">
                    <div className="kpi-label">{k.label}</div>
                    <div className="kpi-value">{k.value}</div>
                  </div>
                ))}
              </div>

            <div className="analytics-charts-grid">

                <div className="chart-card">
                  <div className="chart-card-header">
                    <div>
                      <div className="chart-card-title">Weekly downloads</div>
                      <div className="chart-card-sub">Last 8 weeks</div>
                    </div>
                  </div>
                  <div className="chart-placeholder">
                    {stats.weeklyDownloads.map((d) => {
                      const heightPct = loaded ? (d.count / maxWeekly) * 100 : 0;
                      return (
                        <div key={d.week} className="chart-bar-wrap">
                          <div
                            className="chart-bar"
                            style={{
                              height: `${heightPct}%`,
                              background: d.week === "W8" ? "var(--yellow)" : "rgba(255,230,0,0.2)",
                              transition: "height 0.8s ease",
                            }}
                            title={`${d.count} downloads`}
                          />
                          <span className="chart-bar-lbl">{d.week}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="chart-card">
                  <div className="chart-card-header">
                    <div>
                      <div className="chart-card-title">Platform split</div>
                      <div className="chart-card-sub">iOS vs Android</div>
                    </div>
                  </div>
                  <DonutChart ios={stats.iosCount} android={stats.androidCount} />
                </div>
              </div>

              
              <div className="chart-card">
                <div className="chart-card-header">
                  <div>
                    <div className="chart-card-title">Feedback by category</div>
                    <div className="chart-card-sub">Click a category to see all feedback</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                  {stats.feedbackByCategory.map((item) => (
                    <div 
                      key={item.category} 
                      style={{
                        background: "var(--black-3)",
                        borderRadius: 12,
                        padding: "16px 18px",
                        borderLeft: `3px solid ${CATEGORY_COLORS[item.category] ?? "var(--gray-3)"}`,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onClick={() => handleCategoryClick(item.category)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.02)";
                        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div style={{ fontSize: 12, color: "var(--gray-3)", marginBottom: 4 }}>{item.category}</div>
                      <div style={{
                        fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800,
                        color: CATEGORY_COLORS[item.category] ?? "var(--gray-3)",
                      }}>
                        {item._count.category}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--gray-4)", marginTop: 2 }}>
                        submissions
                        <span style={{ marginLeft: 8, fontSize: 10, color: "var(--gray-4)" }}>
                          click to view →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>
      </main>

      {showModal && selectedCategory && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(8px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            animation: "fadeIn 0.2s ease",
          }}
          onClick={closeModal}
        >
          <div 
            style={{
              background: "#1a1a1a",
              borderRadius: 16,
              maxWidth: 700,
              width: "100%",
              maxHeight: "80vh",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: "24px 28px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexShrink: 0,
            }}>
              <div>
                <h2 style={{ 
                  fontFamily: "var(--font-display)", 
                  fontSize: 20, 
                  fontWeight: 700,
                  color: CATEGORY_COLORS[selectedCategory] ?? "var(--white)",
                }}>
                  {selectedCategory}
                </h2>
                <p style={{ fontSize: 13, color: "var(--gray-3)", marginTop: 4 }}>
                  {filteredFeedback.length} {filteredFeedback.length === 1 ? "submission" : "submissions"}
                </p>
              </div>
              <button
                onClick={closeModal}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--gray-3)",
                  fontSize: 24,
                  cursor: "pointer",
                  padding: "4px 8px",
                  borderRadius: 4,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--white)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "var(--gray-3)"}
              >
                ×
              </button>
            </div>

            <div style={{
              padding: "20px 28px 28px",
              overflowY: "auto",
              flex: 1,
            }}>
              {filteredFeedback.length === 0 ? (
                <div style={{ textAlign: "center", color: "var(--gray-3)", padding: "20px 0" }}>
                  No feedback in this category yet.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {filteredFeedback.map((item) => (
                    <div 
                      key={item.id}
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        borderRadius: 10,
                        padding: "16px 20px",
                        borderLeft: `3px solid ${CATEGORY_COLORS[item.category] ?? "var(--gray-3)"}`,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <div>
                          <span style={{ color: "var(--yellow)" }}>
                            {"★".repeat(item.rating)}
                          </span>
                          <span style={{ color: "var(--gray-4)", marginLeft: 8, fontSize: 12 }}>
                            {item.rating}/5
                          </span>
                        </div>
                        <span style={{ fontSize: 11, color: "var(--gray-4)" }}>
                          {new Date(item.createdAt).toLocaleDateString("en-US", { 
                            month: "short", 
                            day: "numeric",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                      <p style={{ 
                        fontSize: 14, 
                        lineHeight: 1.6, 
                        color: "var(--gray-2)", 
                        marginBottom: 8 
                      }}>
                        {item.message}
                      </p>
                      <div style={{ fontSize: 12, color: "var(--gray-4)" }}>
                        {item.userName ? (
                          <strong style={{ color: "var(--gray-2)" }}>{item.userName}</strong>
                        ) : (
                          "Anonymous"
                        )}
                        {item.userEmail && (
                          <span style={{ marginLeft: 8, fontSize: 11, color: "var(--gray-4)" }}>
                            ({item.userEmail})
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      <Footer />
    </>
  );
}