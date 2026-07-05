"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";

type Review = {
  id: number;
  name: string;
  city: string;
  rating: number;
  type: "rider" | "driver";
  review: string;
  createdAt: string;
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

function initials(name: string) {
  return name.charAt(0).toUpperCase();
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "1 week ago";
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}

export default function ReviewsPage() {
  const [tab, setTab] = useState<"rider" | "driver">("rider");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [barsVisible, setBarsVisible] = useState(false);

  function transformFeedbackToReviews(feedbackItems: FeedbackItem[]): Review[] {
    return feedbackItems.map((f) => ({
      id: f.id,
      name: f.userName || "Anonymous",
      city: "Lebanon", 
      rating: f.rating,
      type: "rider" as const, 
      review: f.message,
      createdAt: f.createdAt,
    }));
  }

 
  useEffect(() => {
    fetch("/api/feedback")
      .then((r) => r.json())
      .then((data) => {
        const feedbackItems: FeedbackItem[] = data.feedback ?? [];
        const reviews = transformFeedbackToReviews(feedbackItems);
        setAllReviews(reviews);
        setTimeout(() => setBarsVisible(true), 300);
      })
      .catch(() => {
        
        setAllReviews([
          { id: 1, name: "Sara M.", city: "Beirut", rating: 5, type: "rider", review: "The booking flow is incredibly smooth. Under 30 seconds from open to confirmed driver.", createdAt: new Date().toISOString() },
          { id: 2, name: "Karim J.", city: "Jounieh", rating: 4, type: "rider", review: "Driver was polite and professional. Car was clean.", createdAt: new Date(Date.now() - 86400000).toISOString() },
        ]);
        setTimeout(() => setBarsVisible(true), 300);
      });

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observer.unobserve(e.target);
        }
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

 useEffect(() => {
    setLoading(true);
    fetch("/api/feedback")
      .then((r) => r.json())
      .then((data) => {
        const feedbackItems: FeedbackItem[] = data.feedback ?? [];
        const allReviews = transformFeedbackToReviews(feedbackItems);
        
        let filtered = allReviews;
        if (tab === "rider") {
          filtered = allReviews.filter(r => 
            ["App experience", "Ride quality", "Pricing"].includes(
               feedbackItems.find(f => f.id === r.id)?.category || ""
            )
          );
        } else {
          filtered = allReviews.filter(r => 
            ["Driver behavior", "Support", "Other"].includes(
              feedbackItems.find(f => f.id === r.id)?.category || ""
            )
          );
        }
        setReviews(filtered.length > 0 ? filtered : allReviews);
        setLoading(false);
      })
      .catch(() => {
        setReviews([]);
        setLoading(false);
      });
  }, [tab]);

  const avgRating = allReviews.length
    ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
    : "0.0";

  const totalCount = allReviews.length;

  const ratingBars = [5, 4, 3, 2, 1].map((star) => {
    const count = allReviews.filter((r) => r.rating === star).length;
    const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
    return { stars: star, pct, count };
  });

  return (
    <>
      <Navbar />

      <main className="reviews-page">
        <div className="container">

          <div style={{ maxWidth: 560 }}>
            <p className="section-label">Reviews</p>
            <h1 className="page-hero-title" style={{ fontSize: "clamp(36px, 5vw, 64px)", textAlign: "left" }}>
              Riders & drivers<br />
              <span style={{ color: "var(--yellow)" }}>love Yalla</span>
            </h1>
            <p style={{ color: "var(--gray-3)", fontSize: 16, marginTop: 12, lineHeight: 1.7 }}>
              {totalCount > 0
                ? `${totalCount} real reviews from real people — both sides of the ride.`
                : "Real reviews from real people — both sides of the ride."}
            </p>
          </div>

          <div className="reviews-summary reveal">
            <div className="reviews-big-score">
              <div className="reviews-big-num">{avgRating}</div>
              <div className="reviews-big-stars" style={{ color: "var(--yellow)" }}>★★★★★</div>
              <div className="reviews-big-count">{totalCount} ratings</div>
            </div>
            <div className="reviews-bars">
              {ratingBars.map((bar) => (
                <div key={bar.stars} className="reviews-bar-row">
                  <span className="reviews-bar-label">{bar.stars}★</span>
                  <div className="reviews-bar-track">
                    <div
                      className="reviews-bar-fill"
                      style={{ width: barsVisible ? `${bar.pct}%` : "0%" }}
                    />
                  </div>
                  <span className="reviews-bar-pct">{bar.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, margin: "48px 0 32px" }}>
            {(["rider", "driver"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: "10px 24px",
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 700,
                  border: "1px solid",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background: tab === t ? "var(--yellow)" : "transparent",
                  color: tab === t ? "var(--black)" : "var(--gray-3)",
                  borderColor: tab === t ? "var(--yellow)" : "rgba(255,255,255,0.15)",
                }}
              >
                {t === "rider" ? <i className="fas fa-user"></i> : <i className="fas fa-car"></i>}
                {t === "rider" ?" general" : " Drivers"}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--gray-3)" }}>
              Loading reviews…
            </div>
          ) : reviews.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--gray-3)" }}>
              No reviews yet. Be the first to share your experience!
            </div>
          ) : (
            <div className="reviews-masonry">
              {reviews.map((r, i) => (
                <article key={r.id} className="review-card">
                  <div className="review-stars" style={{ color: "var(--yellow)" }}>
                    {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                  </div>
                  <p className="review-quote">&ldquo;{r.review}&rdquo;</p>
                  <div className="review-author">
                    <div className="review-avatar">{initials(r.name)}</div>
                    <div>
                      <div className="review-name">{r.name}</div>
                      <div className="review-city">{r.city} · {timeAgo(r.createdAt)}</div>
                    </div>
                  </div>
                  <div className="review-verified">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {r.type === "rider" ? "Verified rider" : "Verified driver"}
                  </div>
                </article>
              ))}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}