"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const nav = document.getElementById("nav");
    const handleScroll = () => {
      nav?.classList.toggle("scrolled", window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, []);

  const handleLogoutClick = () => {
    setOpen(false);
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <nav id="nav" className="nav">
        <div className="nav-inner">
          {/* Logo */}
          <Link href="/" className="nav-logo">
            <span className="nav-logo-text">Yalla</span>
          </Link>

          {/* Burger button  */}
          <button
            className={`nav-menu-btn ${open ? "open" : ""}`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>

          <ul className="nav-links">
            <li><Link href="/features">Features</Link></li>
            <li><Link href="/download">Download</Link></li>
            <li><Link href="/reviews">Reviews</Link></li>
            <li><Link href="/analytics">Analytics</Link></li>
            <li><Link href="/feedback">Feedback</Link></li>
            {session && (
              <>
                <li><Link href="/download">Download</Link></li>
                {(session.user as any)?.role === "admin" && (
                  <li><Link href="/admin">Admin</Link></li>
                )}
              </>
            )}
          </ul>

          
        </div>

        {/* Sidebar */}
        <div className={`sidebar ${open ? "open" : ""}`}>
          <ul>
            <li><Link href="/features" onClick={() => setOpen(false)}>Features</Link></li>
            <li><Link href="/reviews" onClick={() => setOpen(false)}>Reviews</Link></li>
            <li><Link href="/analytics" onClick={() => setOpen(false)}>Analytics</Link></li>
            <li><Link href="/feedback" onClick={() => setOpen(false)}>Feedback</Link></li>
            <li><Link href="/download" onClick={() => setOpen(false)}>Download</Link></li>
           <span style={{ display: "block", height: 1, backgroundColor: "#ccc", margin: "10px 0" }} />
            {(session?.user as any)?.role === "admin" && (
              <li><Link href="/admin" onClick={() => setOpen(false)}>Admin</Link></li>
            )}
          </ul>
          <div className="sidebar-cta">
            {session ? (
              <button
                className="btn-nav"
                onClick={handleLogoutClick}
              >
                Logout
              </button>
            ) : (
              <Link href="/login" className="btn-nav" onClick={() => setOpen(false)}>
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Overlay */}
        {open && <div className="overlay" onClick={() => setOpen(false)} />}
      </nav>

     {showLogoutModal && (
        <div className="modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon"><i className="fas fa-sign-out-alt" /></div>
            <h3 className="modal-title">Sign Out</h3>
            <p className="modal-message">
              Are you sure you want to sign out?
              <br />
              <span style={{ fontSize: 13, color: "var(--gray-4)" }}>
                You will need to sign in again to access your account.
              </span>
            </p>
            <div className="modal-actions">
              <button 
                className="modal-btn modal-btn-cancel"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button 
                className="modal-btn modal-btn-danger"
                onClick={confirmLogout}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.2s ease;
        }

        .modal-container {
          background: var(--black-2);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 40px 36px 32px;
          max-width: 400px;
          width: 90%;
          text-align: center;
          animation: slideUp 0.3s ease;
        }

        .modal-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .modal-title {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 700;
          color: var(--white);
          margin-bottom: 8px;
        }

        .modal-message {
          font-size: 14px;
          color: var(--gray-3);
          line-height: 1.6;
          margin-bottom: 28px;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
        }

        .modal-btn {
          flex: 1;
          padding: 12px 20px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .modal-btn-cancel {
          background: var(--black-3);
          color: var(--gray-3);
          border: 1px solid rgba(255,255,255,0.06);
        }
        .modal-btn-cancel:hover {
          background: var(--black-4);
          color: var(--white);
        }

        .modal-btn-danger {
          background: #dc2626;
          color: white;
        }
        .modal-btn-danger:hover {
          background: #b91c1c;
          transform: translateY(-1px);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 720px) {
          .modal-container {
            padding: 32px 24px 28px;
          }
          .modal-actions {
            flex-direction: column;
          }
          .modal-btn {
            padding: 14px;
          }
        }
      `}</style>
    </>
  );
}