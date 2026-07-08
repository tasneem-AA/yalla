"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer" aria-label="Site footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Link href="/" className="nav-logo">
              <span className="nav-logo-text">Yalla</span>
            </Link>
            <p className="footer-brand-desc">
              Fast, safe rides across Lebanon. Book in seconds, track in real time, arrive on time.
            </p>
            {/* 🔐 ADMIN LOGIN BUTTON */}
            <div style={{ marginTop: "20px" }}>
              <Link href="/login" className="btn-nav" style={{ display: "inline-block" }}>
                🔐 Admin Login
              </Link>
            </div>
          </div>
          <div>
            <p className="footer-col-title">Product</p>
            <ul className="footer-links">
              <li><Link href="/#how">How it works</Link></li>
              <li><Link href="/features">Features</Link></li>
              <li><Link href="/download">Download</Link></li>
            </ul>
          </div>
          <div>
            <p className="footer-col-title">Company</p>
            <ul className="footer-links">
              <li><Link href="/">About us</Link></li>
              <li><Link href="/#features">Drive with Yalla</Link></li>
              <li><Link href="/">Careers</Link></li>
              <li><Link href="/admin">Admin Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <p className="footer-col-title">Support</p>
            <ul className="footer-links">
              <li><Link href="/feedback">Help center</Link></li>
              <li><Link href="/#features">Safety</Link></li>
              <li><Link href="/">Privacy policy</Link></li>
              <li><Link href="/">Terms of service</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 Yalla. All rights reserved.</span>
          <div className="footer-socials">
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Yalla on X">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Yalla on Instagram">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5"/>
                <circle cx="12" cy="12" r="5"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Yalla on Facebook">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}