"use client";
import Image from 'next/image';

import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    //Navbar glass effect on scroll 
    const nav = document.getElementById("nav");
    const handleScroll = () => {  
      nav?.classList.toggle("scrolled", window.scrollY > 20);
    
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    //Scroll reveal animation
    
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

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);
  return (
    <>

      {/* navbar*/}
      <nav className="nav" id="nav" aria-label="Main navigation">
        <div className="nav-inner">
            <span className="nav-logo-text">Yalla</span>
          

          <ul className="nav-links" role="list">
            <li><a href="#how">How it works</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#reviews">Reviews</a></li>
          </ul>

          <div className="nav-cta">
            <a href="#download" className="btn-nav">Download app</a>
          </div>

          <button className="nav-menu-btn" aria-label="Open menu">
            <span></span><span></span><span></span>
          </button>

        </div>
      </nav>

      {/*HERO*/}
      <section className="hero container" aria-labelledby="hero-heading">

        <div className="hero-left">
          <div className="hero-tag">
            <span className="tag">
              <span className="tag-dot" aria-hidden="true"></span>
              Now available in lebanon
            </span>
          </div>

          <h1 className="hero-headline" id="hero-heading">
            Your ride,<br/><em>instantly.</em>
          </h1>

          <p className="hero-sub">
            Book a car in seconds. Track it live. Pay your way.
            Yalla gets you moving without the wait.
          </p>

          <div className="hero-actions">
            <a href="#download" className="btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Get the app
            </a>
            <a href="#how" className="btn-ghost">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <polygon points="10 8 16 12 10 16 10 8" fill="currentColor"/>
              </svg>
              See how it works
            </a>
          </div>

          <div className="store-badges" aria-label="Download links">
            <a href="#download" className="store-badge">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div>
                <div className="store-badge-label">Download on the</div>
                <div className="store-badge-name">App Store</div>
              </div>
            </a>
            <a href="#download" className="store-badge">
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
              <div className="notif-icon">🚗</div>
              <div>
                <div className="notif-title">Driver on the way</div>
                <div className="notif-sub">Gregory · 2 min away</div>
              </div>
            </div>
            <div className="phone-frame">
            
                <img 
                  src="/images/ride.png" 
                  alt="Yalla app interface" 
                  className="w-full h-auto rounded-[36px]" 
                />
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
              { icon: "📍", num: "1", title: "Set your pickup",      desc: "Your current location is detected automatically. Drag the pin to adjust it exactly." },
              { icon: "🗺️", num: "2", title: "Choose destination",   desc: "Search any address or pick from your saved places. Recent trips appear instantly." },
              { icon: "🚗", num: "3", title: "Pick a ride",          desc: "See live prices and arrival times for every vehicle type. No surprises." },
              { icon: "✅", num: "4", title: "Sit back & track",     desc: "Watch your driver move toward you on the map. Call or chat directly from the app." },
            ].map((step, i) => (
              <div key={i} className={`step-card reveal ${i > 0 ? `reveal-delay-${i}` : ""}`}>
                <div className="step-icon-wrap" aria-hidden="true">{step.icon}</div>
                <div className="step-num" aria-hidden="true">{step.num}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES*/}
      <section className="features" id="features" aria-labelledby="features-heading">
        <div className="container">
          <div className="features-header">
            <p className="section-label">Features</p>
            <h2 className="section-title" id="features-heading">Everything you need,<br/>nothing you don't</h2>
          </div>
          <div className="features-grid">

            <div className="feature-card feature-card--large reveal">
              <div>
                <div className="feature-icon feature-icon--yellow" aria-hidden="true">🚘</div>
                <h3 className="feature-title">Six ride types, one tap away</h3>
                <p className="feature-desc">Standard, Luxury, Limousine, Electric, Bike, Taxi 4seat,Taxi 7 seat — pick the right vehicle for your mood, party size, and budget.</p>
              </div>
              <div className="vehicle-showcase">
                {[
                  { emoji:"🚗", name:"Standard", eta:"3 min", price:"$ 25" },
                  { emoji:"🚙", name:"Luxury",   eta:"3 min", price:"$ 50" },
                  { emoji:"🏍️", name:"Bike",     eta:"3 min", price:"$ 15" },
                  { emoji:"⚡", name:"Electric", eta:"2 min", price:"$ 25" },
                ].map((v) => (
                  <div key={v.name} className="vehicle-row">
                    <span className="vehicle-row-emoji">{v.emoji}</span>
                    <span className="vehicle-row-name">{v.name}</span>
                    <span className="vehicle-row-eta">{v.eta}</span>
                    <span className="vehicle-row-price">{v.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="feature-card reveal reveal-delay-1">
              <div className="feature-icon feature-icon--blue">🗺️</div>
              <h3 className="feature-title">Live GPS tracking</h3>
              <p className="feature-desc">Follow your driver in real time on the map. Know exactly when they&apos;ll arrive — down to the second.</p>
            </div>

            <div className="feature-card reveal">
              <div className="feature-icon feature-icon--green">🛡️</div>
              <h3 className="feature-title">Built-in safety</h3>
              <p className="feature-desc">Every driver is verified. Share your trip live with family. Call or message your driver directly from the app.</p>
            </div>

            <div className="feature-card reveal reveal-delay-1">
              <div className="feature-icon feature-icon--purple">💳</div>
              <h3 className="feature-title">Pay your way</h3>
              <p className="feature-desc">Cash, credit card, or saved card on file. Choose at booking. No surprises at the end of your ride.</p>
            </div>

            <div className="feature-card reveal reveal-delay-2">
              <div className="feature-icon feature-icon--orange">🤝</div>
              <h3 className="feature-title">Choose your driver</h3>
              <p className="feature-desc">Prefer a male or female driver? Set it once and every booking will match your preference automatically.</p>
            </div>

          </div>
        </div>
      </section>


      {/*REVIEWS*/}
      <section className="reviews" id="reviews" aria-labelledby="reviews-heading">
        <div className="container">
          <div className="reviews-header">
            <p className="section-label">Reviews</p>
            <h2 className="section-title" id="reviews-heading">Riders love Yalla</h2>
            <p className="section-sub">Over 500,000 rides completed. Here&apos;s what people say.</p>
          </div>
          <div className="reviews-grid">
            {[
              { init:"S", name:"Sara M.",  city:"lebanon ",      quote:"I booked my ride in literally 30 seconds. The driver was there before I even got downstairs. Nothing beats this in Cairo traffic." },
             ].map((r, i) => (
              <article key={r.name} className={`review-card reveal ${i > 0 ? `reveal-delay-${i}` : ""}`}>
                <div className="review-stars" aria-label="5 stars">★★★★★</div>
                <p className="review-quote">"{r.quote}"</p>
                <div className="review-author">
                  <div className="review-avatar" aria-hidden="true">{r.init}</div>
                  <div>
                    <div className="review-name">{r.name}</div>
                    <div className="review-city">{r.city}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* DOWNLOAD CTA*/}
      <section className="download" id="download" aria-labelledby="download-heading">
        <div className="container">
          <div className="download-inner">
            <div>
              <p className="section-label">Download</p>
              <h2 className="download-title" id="download-heading">
                Ready to<br/><span>ride smarter?</span>
              </h2>
              <p className="download-sub">
                Join half a million riders in lebanon.
                Download Yalla free — your first ride is on us.
              </p>
              <div className="download-badges">
                <a href="#" className="store-badge">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div>
                    <div className="store-badge-label">Download on the</div>
                    <div className="store-badge-name">App Store</div>
                  </div>
                </a>
                <a href="#" className="store-badge">
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
                <rect x="8"  y="8"  width="30" height="30" rx="4" fill="#0d0d0d"/>
                <rect x="12" y="12" width="22" height="22" rx="2" fill="white"/>
                <rect x="15" y="15" width="16" height="16" rx="1" fill="#0d0d0d"/>
                <rect x="82" y="8"  width="30" height="30" rx="4" fill="#0d0d0d"/>
                <rect x="86" y="12" width="22" height="22" rx="2" fill="white"/>
                <rect x="89" y="15" width="16" height="16" rx="1" fill="#0d0d0d"/>
                <rect x="8"  y="82" width="30" height="30" rx="4" fill="#0d0d0d"/>
                <rect x="12" y="86" width="22" height="22" rx="2" fill="white"/>
                <rect x="15" y="89" width="16" height="16" rx="1" fill="#0d0d0d"/>
                <rect x="54" y="54" width="12" height="12" rx="2" fill="#FFE600"/>
              </svg>
              <div className="qr-label" style={{ color: "#0d0d0d" }}>Scan to download</div>
              
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER*/}
      <footer className="footer" aria-label="Site footer">
        <div className="container">
          <div className="footer-top">
            <div>
              <a href="#" className="nav-logo">
              
                <span className="nav-logo-text">Yalla</span>
              </a>
              <p className="footer-brand-desc">Fast, safe rides across lebanon . Book in seconds, track in real time, arrive on time.</p>
            </div>
            <div>
              <p className="footer-col-title">Product</p>
              <ul className="footer-links">
                <li><a href="#how">How it works</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#rides">Ride types</a></li>
                <li><a href="#download">Download</a></li>
              </ul>
            </div>
            <div>
              <p className="footer-col-title">Company</p>
              <ul className="footer-links">
                <li><a href="#">About us</a></li>
                <li><a href="#">Drive with Yalla</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Press</a></li>
              </ul>
            </div>
            <div>
              <p className="footer-col-title">Support</p>
              <ul className="footer-links">
                <li><a href="#">Help center</a></li>
                <li><a href="#">Safety</a></li>
                <li><a href="#">Privacy policy</a></li>
                <li><a href="#">Terms of service</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2025 Yalla. All rights reserved.</span>
            <div className="footer-socials">
              <a href="#" className="social-btn" aria-label="Yalla on X">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="social-btn" aria-label="Yalla on Instagram">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5"/>
                  <circle cx="12" cy="12" r="5"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              <a href="#" className="social-btn" aria-label="Yalla on Facebook">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}