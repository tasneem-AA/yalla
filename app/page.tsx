"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useEffect, useState } from "react";

type Review = {
  id: number;
  name: string;
  rating: number;
  review: string;
  createdAt: string;
};

export default function HomePage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetch("/api/feedback")
      .then((r) => r.json())
      .then((data) => {
        const feedbackItems = data.feedback ?? [];
       const topReviews = feedbackItems
          .map((item: any) => ({
            id: item.id,
            name: item.userName || "Anonymous",
            rating: item.rating,
            review: item.message,
            createdAt: item.createdAt,
          }))
          .sort((a: Review, b: Review) => b.rating - a.rating) 
          .slice(0, 3); 


        
        setReviews(topReviews);
        setLoading(false);
      })
    
      
    ;
  }, []);

  function getInitials(name: string) {
    return name.charAt(0).toUpperCase();
  }

  // ─── Video Modal Functions ───
  const openVideoModal = () => setIsVideoModalOpen(true);
  const closeVideoModal = () => setIsVideoModalOpen(false);

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="hero container" aria-labelledby="hero-heading" style={{ marginTop: "50px" }}>
        <div className="hero-left">
          <div className="hero-tag">
            <span className="tag">
              <span className="tag-dot" aria-hidden="true"></span>
              Now available in Lebanon
            </span>
          </div>

          <h1 className="hero-headline" id="hero-heading">
            Your ride,<br /><em>instantly.</em>
          </h1>

          <p className="hero-sub">
            Book a car in seconds. Track it live. Pay your way.
            Yalla gets you moving without the wait.
          </p>

          <div className="hero-actions">
            <Link href="/download" className="btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Get the app
            </Link>
            {/* ─── UPDATED: Open video modal ─── */}
            <button onClick={openVideoModal} className="btn-ghost">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <polygon points="10 8 16 12 10 16 10 8" fill="currentColor"/>
              </svg>
              See how it works
            </button>
          </div>

          <div className="store-badges" aria-label="Download links">
            <a href="/download" className="store-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div>
                <div className="store-badge-label">Download on the</div>
                <div className="store-badge-name">App Store</div>
              </div>
            </a>
            <a href="/download" className="store-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3.18 23.76c.3.17.65.2.98.07l11.65-6.73-2.6-2.6-10.03 9.26z" fill="#EA4335"/>
                <path d="M22.23 10.07l-2.98-1.72-2.93 2.65 2.93 2.93 2.98-1.72c.85-.49.85-1.65 0-2.14z" fill="#FBBC05"/>
                <path d="M1.27.76C1.1 1.02 1 1.34 1 1.72v20.56c0 .38.1.7.27.96l10.03-9.26L1.27.76z" fill="#4285F4"/>
                <path d="M13.81 12l2.6-2.6L4.16.67C3.83.5 3.47.53 3.18.7L13.81 12z" fill="#34A853"/>
              </svg>
              <div>
                <div className="store-badge-label">Get it on</div>
                <div className="store-badge-name">Google Play</div>
              </div>
            </a>
          </div>
        </div>

        {/* Phone mockup */}
        <div className="hero-right" aria-hidden="true">
          <div className="phone-wrap">
            <div className="phone-notif">
              <div className="notif-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                </svg>
              </div>
              <div>
                <div className="notif-title">Driver on the way</div>
                <div className="notif-sub">Gregory · 2 min away</div>
              </div>
            </div>
            <div className="phone-frame">
              <img src="/images/ride.png" alt="Yalla app interface" className="w-full h-auto rounded-[36px]"/>
            </div>
            <div className="phone-rating">
              <div className="rating-stars">★★★★★</div>
              <div className="rating-label">App Store rating</div>
              <div className="rating-num"></div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how" id="how" aria-labelledby="how-heading">
        <div className="container">
          <div className="how-header">
            <p className="section-label">How it works</p>
            <h2 className="section-title" id="how-heading">A ride in four steps</h2>
            <p className="section-sub">From opening the app to arriving at your door — the whole booking takes under a minute.</p>
          </div>
          <div className="steps-grid">
            {[
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                ),
                num: "1", title: "Set your pickup",
                desc: "Your current location is detected automatically. Drag the pin to adjust it exactly.",
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/>
                  </svg>
                ),
                num: "2", title: "Choose destination",
                desc: "Search any address or pick from your saved places. Recent trips appear instantly.",
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                  </svg>
                ),
                num: "3", title: "Pick a ride",
                desc: "See live prices and arrival times for every vehicle type. No surprises.",
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                ),
                num: "4", title: "Sit back & track",
                desc: "Watch your driver move toward you on the map. Call or chat directly from the app.",
              },
            ].map((step, i) => (
              <div key={i} className={`step-card reveal ${i > 0 ? `reveal-delay-${i}` : ""}text-center`}>
                <div className="step-icon-wrap mx-auto" aria-hidden="true">{step.icon}</div>
                <div className="step-num mx-auto" aria-hidden="true">{step.num}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features" id="features" aria-labelledby="features-heading">
        <div className="container">
          <div className="features-header">
            <p className="section-label">Features</p>
            <h2 className="section-title" id="features-heading">Everything you need,<br/>nothing you don&apos;t</h2>
          </div>
          <div className="features-grid">
            <div className="feature-card feature-card--large reveal text-center">
              <div>
                <div className="feature-icon feature-icon--yellow" aria-hidden="true">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                  </svg>
                </div>
                <h3 className="feature-title">Six ride types, one tap away</h3>
                <p className="feature-desc">Standard, Luxury, Limousine, Electric, Bike, Taxi 4-seat, Taxi 7-seat — pick the right vehicle for your mood, party size, and budget.</p>
              </div>
              <div className="vehicle-showcase">
                {[
                  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>, name: "Standard", eta: "3 min", price: "$ 25" },
                  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>, name: "Luxury", eta: "3 min", price: "$ 50" },
                  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.44 9.03L15.41 5H11v2h3.59l2 2H4c-1.1 0-2 .9-2 2v3h2c0 1.66 1.34 3 3 3s3-1.34 3-3h4c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-3.17l-2.56-2.8zM7 17c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm10 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>, name: "Bike", eta: "3 min", price: "$ 15" },
                  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4v2H4L2 12v4h2c0 1.11.89 2 2 2s2-.89 2-2h8c0 1.11.89 2 2 2s2-.89 2-2h2v-4l-2-6H7zm-.5 9c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm9 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zM7.5 6h9l1.5 4.5h-12L7.5 6z"/></svg>, name: "Electric", eta: "2 min", price: "$ 25" },
                ].map((v) => (
                  <div key={v.name} className="vehicle-row">
                    <span className="vehicle-row-emoji">{v.icon}</span>
                    <span className="vehicle-row-name">{v.name}</span>
                    <span className="vehicle-row-eta">{v.eta}</span>
                    <span className="vehicle-row-price">{v.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="feature-card reveal reveal-delay-1 text-center">
              <div className="feature-icon feature-icon--blue mx-auto">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <h3 className="feature-title">Live GPS tracking</h3>
              <p className="feature-desc">Follow your driver in real time on the map. Know exactly when they&apos;ll arrive — down to the second.</p>
            </div>

            <div className="feature-card reveal text-center">
              <div className="feature-icon feature-icon--green">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                </svg>
              </div>
              <h3 className="feature-title">Built-in safety</h3>
              <p className="feature-desc">Every driver is verified. Share your trip live with family. Call or message your driver directly from the app.</p>
            </div>

            <div className="feature-card reveal reveal-delay-1 text-center">
              <div className="feature-icon feature-icon--purple">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                </svg>
              </div>
              <h3 className="feature-title">Pay your way</h3>
              <p className="feature-desc">Cash, credit card, or saved card on file. Choose at booking. No surprises at the end of your ride.</p>
            </div>

            <div className="feature-card reveal reveal-delay-2 text-center">
              <div className="feature-icon feature-icon--orange">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <h3 className="feature-title">Choose your driver</h3>
              <p className="feature-desc">Prefer a male or female driver? Set it once and every booking will match your preference automatically.</p>
            </div>
          </div>
        </div>
      </section>
         {/* REVIEWS  */}
<section className="reviews" id="reviews" aria-labelledby="reviews-heading">
  <div className="container">
    <div className="reviews-header">
      <p className="section-label">Reviews</p>
      <h2 className="section-title" id="reviews-heading">Riders love Yalla</h2>
      <p className="section-sub">Real feedback from real people. Here&apos;s what they say.</p>
    </div>
    {loading ? (
      <div style={{ textAlign: "center", padding: "40px 0", color: "#999999" }}>
        Loading reviews...
      </div>
    ) : reviews.length === 0 ? (
      <div style={{ textAlign: "center", padding: "40px 0", color: "#999999" }}>
        No reviews yet. Be the first to share your experience!
      </div>
    ) : (
      <div className="reviews-grid">
        {reviews.map((review, i) => (
          <div 
            key={review.id} 
            style={{
              background: "#1a1a1a",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "16px",
              padding: "32px 28px",
              transition: "border-color 0.3s, transform 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,230,0,0.2)";
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{ 
              color: "#FFE600", 
              fontSize: "18px",
              letterSpacing: "2px",
              marginBottom: "18px"
            }}>
              {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
            </div>
            <p style={{ 
              fontSize: "15px", 
              lineHeight: "1.7", 
              color: "#e0e0e0",
              marginBottom: "24px"
            }}>
              &ldquo;{review.review}&rdquo;
            </p>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              paddingTop: "16px",
              borderTop: "1px solid rgba(255,255,255,0.06)"
            }}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "#FFE600",
                color: "#000000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "15px",
                flexShrink: 0
              }}>
                {getInitials(review.name)}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "14px", color: "#ffffff" }}>
                  {review.name}
                </div>
                <div style={{ fontSize: "12px", color: "#999999", marginTop: "2px" }}>
                  Verified rider
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
    <div style={{ textAlign: "center", marginTop: "32px" }}>
      <Link href="/reviews" style={{ 
        padding: "10px 28px",
        borderRadius: "999px",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "#e0e0e0",
        textDecoration: "none",
        fontSize: "14px",
        fontWeight: 600,
        transition: "all 0.2s ease",
        display: "inline-block",
      }}>
        See all reviews →
      </Link>
    </div>
  </div>
</section>
      {/* DOWNLOAD CTA */}
      <section className="download" id="download" aria-labelledby="download-heading">
        <div className="container">
          <div className="download-inner">
            <div>
              <p className="section-label">Download</p>
              <h2 className="download-title" id="download-heading">
                Ready to<br/><span>ride smarter?</span>
              </h2>
              <p className="download-sub">
                  Join  riders in Lebanon.
                Download Yalla free .
              </p>
              <div className="download-badges">
                <a href="/download" className="store-badge">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div>
                    <div className="store-badge-label">Download on the</div>
                    <div className="store-badge-name">App Store</div>
                  </div>
                </a>
                <a href="/download" className="store-badge">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M3.18 23.76c.3.17.65.2.98.07l11.65-6.73-2.6-2.6-10.03 9.26z" fill="#EA4335"/>
                    <path d="M22.23 10.07l-2.98-1.72-2.93 2.65 2.93 2.93 2.98-1.72c.85-.49.85-1.65 0-2.14z" fill="#FBBC05"/>
                    <path d="M1.27.76C1.1 1.02 1 1.34 1 1.72v20.56c0 .38.1.7.27.96l10.03-9.26L1.27.76z" fill="#4285F4"/>
                    <path d="M13.81 12l2.6-2.6L4.16.67C3.83.5 3.47.53 3.18.7L13.81 12z" fill="#34A853"/>
                  </svg>
                  <div>
                    <div className="store-badge-label">Get it on</div>
                    <div className="store-badge-name">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
            <div className="qr-wrap" aria-label="Scan QR code to download">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <rect width="120" height="120" fill="white"/>
                <rect x="8" y="8" width="30" height="30" rx="4" fill="#0d0d0d"/>
                <rect x="12" y="12" width="22" height="22" rx="2" fill="white"/>
                <rect x="15" y="15" width="16" height="16" rx="1" fill="#0d0d0d"/>
                <rect x="82" y="8" width="30" height="30" rx="4" fill="#0d0d0d"/>
                <rect x="86" y="12" width="22" height="22" rx="2" fill="white"/>
                <rect x="89" y="15" width="16" height="16" rx="1" fill="#0d0d0d"/>
                <rect x="8" y="82" width="30" height="30" rx="4" fill="#0d0d0d"/>
                <rect x="12" y="86" width="22" height="22" rx="2" fill="white"/>
                <rect x="15" y="89" width="16" height="16" rx="1" fill="#0d0d0d"/>
                <rect x="54" y="54" width="12" height="12" rx="2" fill="#FFE600"/>
              </svg>
              <div className="qr-label" style={{ color: "#0d0d0d" }}>Scan to download</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      {/* ─── VIDEO MODAL ─── */}
      {isVideoModalOpen && (
        <div 
          className="video-modal-overlay" 
          onClick={closeVideoModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(12px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            animation: "fadeIn 0.3s ease",
          }}
        >
          <div 
            className="video-modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--black-2)",
              borderRadius: "24px",
              maxWidth: "900px",
              width: "100%",
              border: "1px solid rgba(255,255,255,0.08)",
              overflow: "hidden",
              position: "relative",
              animation: "slideUp 0.3s ease",
            }}
          >
            {/* Close button */}
            <button
              onClick={closeVideoModal}
              style={{
                position: "absolute",
                top: "16px",
                right: "20px",
                background: "rgba(255,255,255,0.06)",
                border: "none",
                color: "var(--white)",
                fontSize: "24px",
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                cursor: "pointer",
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
                fontWeight: 300,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                e.currentTarget.style.transform = "rotate(90deg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.transform = "rotate(0)";
              }}
            >
              ×
            </button>

            {/* Video title */}
            <div style={{ padding: "24px 28px 16px" }}>
              <h3 style={{
                fontFamily: "var(--font-display)",
                fontSize: "22px",
                fontWeight: 700,
                color: "var(--white)",
                margin: 0,
              }}>
                How Yalla works – in 60 seconds
              </h3>
              <p style={{
                fontSize: "14px",
                color: "var(--gray-3)",
                margin: "8px 0 0 0",
              }}>
                Watch a quick demo of booking a ride from start to finish.
              </p>
            </div>

            {/* Video container */}
            <div style={{
              padding: "0 28px 28px",
            }}>
              <div style={{
                position: "relative",
                paddingBottom: "56.25%", // 16:9 aspect ratio
                height: 0,
                background: "var(--black-3)",
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.06)",
              }}> <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--black-4)",
                  gap: "16px",
                }}>
                  <div style={{
                    fontSize: "72px",
                    opacity: 0.6,
                  }}></div>
                  
                  <div style={{
                    display: "flex",
                    gap: "12px",
                    marginTop: "8px",
                  }}>
                    
                  </div>
                </div>
              </div>
            </div>
           {/* Footer note */}
            <div style={{
              padding: "0 28px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "1px solid rgba(255,255,255,0.04)",
              paddingTop: "16px",
            }}>
              <span style={{
                fontSize: "12px",
                color: "var(--gray-4)",
              }}>
                Available on iOS & Android
              </span>
              <button
                onClick={closeVideoModal}
                style={{
                  background: "var(--yellow)",
                  color: "var(--black)",
                  border: "none",
                  padding: "8px 24px",
                  borderRadius: "999px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── CSS Animation Styles ─── */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Prevent body scroll when modal is open */
        body.modal-open {
          overflow: hidden;
        }
      `}</style>

      
    </>
  );
}