import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function getStats() {
  const [totalDownloads, totalFeedback, totalUsers, feedbackRatings, recentDownloads, recentFeedback] =
    await Promise.all([
      prisma.download.count(),
      prisma.feedback.count(),
      prisma.user.count(),
      prisma.feedback.aggregate({ _avg: { rating: true } }),
      prisma.download.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.feedback.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);
  return { totalDownloads, totalFeedback, totalUsers, avgRating: feedbackRatings._avg.rating?.toFixed(1) ?? "—", recentDownloads, recentFeedback };
}

const DownloadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
  </svg>
);
const MessageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
  </svg>
);
const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
  </svg>
);
const StarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
  </svg>
);

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  const stats = await getStats();

  const kpis = [
    { label: "Total downloads",     value: stats.totalDownloads.toLocaleString(), icon: <DownloadIcon />, color: "var(--yellow)" },
    { label: "Feedback submissions", value: stats.totalFeedback.toLocaleString(),  icon: <MessageIcon />, color: "#4ade80" },
    { label: "Registered users",     value: stats.totalUsers.toLocaleString(),     icon: <UsersIcon />,   color: "#60a5fa" },
    { label: "Avg feedback rating",  value: `${stats.avgRating}★`,               icon: <StarIcon />,    color: "#c084fc" },
  ];

  return (
    <>
      <div>
        <h1 className="admin-page-title">
          Good day, {session?.user?.name?.split(" ")[0] ?? "Admin"}
        </h1>
        <p className="admin-page-sub">Here&apos;s what&apos;s happening with Yalla right now.</p>
      </div>

      <div className="admin-kpi-row">
        {kpis.map((k) => (
          <div key={k.label} className="kpi-card">
            <div style={{ color: k.color, marginBottom: 10 }}>{k.icon}</div>
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value" style={{ fontSize: 28, color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Recent downloads</h2>
      <div className="admin-table-card" style={{ marginBottom: 28 }}>
        <table className="admin-table">
          <thead>
            <tr><th>Platform</th><th>User ID</th><th>Date</th></tr>
          </thead>
          <tbody>
            {stats.recentDownloads.map((d) => (
              <tr key={d.id}>
                <td>
                  <span className={`badge ${d.platform === "ios" ? "badge-yellow" : "badge-green"}`}>
                    {d.platform === "ios" ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ display: "inline", marginRight: 4 }}>
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ display: "inline", marginRight: 4 }}>
                        <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/>
                      </svg>
                    )}
                    {d.platform === "ios" ? "iOS" : "Android"}
                  </span>
                </td>
                <td style={{ fontFamily: "monospace", fontSize: 12, color: "var(--gray-3)" }}>{d.userId ?? "Anonymous"}</td>
                <td style={{ color: "var(--gray-3)" }}>
                  {new Date(d.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Recent feedback</h2>
      <div className="admin-table-card">
        <table className="admin-table">
          <thead>
            <tr><th>Rating</th><th>Category</th><th>From</th><th>Date</th></tr>
          </thead>
          <tbody>
            {stats.recentFeedback.map((f) => (
              <tr key={f.id}>
                <td><span style={{ color: "var(--yellow)" }}>{"★".repeat(f.rating)}</span></td>
                <td><span className="badge badge-gray">{f.category}</span></td>
                <td>{f.userName ?? "Anonymous"}</td>
                <td style={{ color: "var(--gray-3)" }}>
                  {new Date(f.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}