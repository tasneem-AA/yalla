"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect } from "react";

const FEATURES = [
  {
    num: "01",
    icon: (
      <svg width="44" height="44" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
      </svg>
    ),
    title: "Six ride types",
    desc: "Standard, Luxury, Limousine, Electric, Bike, and two Taxi sizes — choose the right vehicle for every situation. Prices and ETAs shown upfront, no hidden fees.",
    tags: ["Standard", "Luxury", "Electric", "Bike", "Taxi 4-seat", "Taxi 7-seat"],
  },
  {
    num: "02",
    icon: (
      <svg width="44" height="44" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    ),
    title: "Live GPS tracking",
    desc: "Watch your driver move toward you on the map in real time. Accurate ETAs calculated from live traffic — not just distance. Know the second they arrive.",
    tags: ["Real-time map", "Traffic-aware ETA", "Driver sharing"],
  },
  {
    num: "03",
    icon: (
      <svg width="44" height="44" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
      </svg>
    ),
    title: "Built-in safety",
    desc: "Every driver is background-checked and verified before their first trip. Share your live trip with trusted contacts. Emergency SOS button always one tap away.",
    tags: ["Driver verification", "Trip sharing", "SOS button"],
  },
  {
    num: "04",
    icon: (
      <svg width="44" height="44" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
      </svg>
    ),
    title: "Flexible payments",
    desc: "Pay with cash, credit card, or a saved card on file. Choose at booking, change up to the moment you're picked up. Digital receipts sent instantly.",
    tags: ["Cash", "Credit card", "Saved cards", "Digital receipts"],
  },
  {
    num: "05",
    icon: (
      <svg width="44" height="44" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
    ),
    title: "Driver preferences",
    desc: "Prefer a male or female driver? Set your preference once and it applies automatically to every booking. Never have to think about it again.",
    tags: ["Gender preference", "One-time setup", "Auto-applied"],
  },
  {
    num: "06",
    icon: (
      <svg width="44" height="44" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
      </svg>
    ),
    title: "Instant booking",
    desc: "From opening the app to a confirmed driver: under 30 seconds. No loading screens, no confirmations that go nowhere. Tap, confirm, done.",
    tags: ["< 30 second booking", "No loading screens", "Instant confirm"],
  },
];

export default function FeaturesPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Navbar />

      <section className="page-hero">
        <div className="container">
          <p className="section-label page-hero-label">Features</p>
          <h1 className="page-hero-title">
            Everything you need,<br />
            <span>nothing you don&apos;t</span>
          </h1>
          <p className="page-hero-sub">
            Yalla is built around one principle: getting you from A to B with zero friction.
            Every feature exists for a reason.
          </p>
        </div>
      </section>

      <section style={{ padding: "0 0 120px" }}>
        <div className="container">
          <div className="features-detail-grid">
            {FEATURES.map((f, i) => (
              <div key={f.num} className={`feature-detail-item reveal reveal-delay-${i % 2}`}>
                <p className="feature-detail-num">{f.num}</p>
                <div className="feature-detail-icon">{f.icon}</div>
                <h2 className="feature-detail-title">{f.title}</h2>
                <p className="feature-detail-desc">{f.desc}</p>
                <div className="feature-detail-tags">
                  {f.tags.map((t) => (
                    <span key={t} className="feature-tag">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="download" aria-label="Download CTA">
        <div className="container">
          <div className="download-inner">
            <div>
              <p className="section-label">Ready?</p>
              <h2 className="download-title">Try every feature<br /><span>for free.</span></h2>
              <div className="download-badges">
                <a href="/download" className="store-badge">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div><div className="store-badge-label">Download on the</div><div className="store-badge-name">App Store</div></div>
                </a>
                <a href="/download" className="store-badge">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M3.18 23.76c.3.17.65.2.98.07l11.65-6.73-2.6-2.6-10.03 9.26z" fill="#EA4335"/>
                    <path d="M22.23 10.07l-2.98-1.72-2.93 2.65 2.93 2.93 2.98-1.72c.85-.49.85-1.65 0-2.14z" fill="#FBBC05"/>
                    <path d="M1.27.76C1.1 1.02 1 1.34 1 1.72v20.56c0 .38.1.7.27.96l10.03-9.26L1.27.76z" fill="#4285F4"/>
                    <path d="M13.81 12l2.6-2.6L4.16.67C3.83.5 3.47.53 3.18.7L13.81 12z" fill="#34A853"/>
                  </svg>
                  <div><div className="store-badge-label">Get it on</div><div className="store-badge-name">Google Play</div></div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}