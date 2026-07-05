"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";

const Icons = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
    </svg>
  ),
  analytics: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
    </svg>
  ),
  download: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
    </svg>
  ),
  feedback: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
    </svg>
  ),
  star: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
    </svg>
  ),
  home: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
  ),
  features: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
    </svg>
  ),
  signout: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
    </svg>
  ),
  menu: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
    </svg>
  ),
  close: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>
  ),
};

const NAV = [
  {
    section: "Overview",
    items: [
      { icon: Icons.dashboard, label: "Dashboard",  href: "/admin" },
      { icon: Icons.analytics, label: "Analytics",  href: "/analytics" },
    ],
  },
  {
    section: "Manage",
    items: [
      { icon: Icons.download, label: "Downloads", href: "/admin/downloads" },
      { icon: Icons.feedback, label: "Feedback",  href: "/admin/feedback" },
      { icon: Icons.star,     label: "Reviews",   href: "/reviews" },
    ],
  },
  {
    section: "Site",
    items: [
      { icon: Icons.home,     label: "Landing page", href: "/" },
      { icon: Icons.features, label: "Features",     href: "/features" },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const toggleSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <button 
        className="admin-sidebar-toggle"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isMobileOpen ? Icons.close : Icons.menu}
      </button>

      {isMobileOpen && (
        <div className="admin-sidebar-overlay" onClick={() => setIsMobileOpen(false)} />
      )}

      <aside className={`admin-sidebar ${isMobileOpen ? "mobile-open" : ""}`}>
        {/* Logo */}
        <div className="admin-sidebar-logo">
          <div className="admin-logo-icon">
            <div className="admin-logo-mark">Y</div>
          </div>
          <span className="admin-sidebar-brand">Admin</span>
        </div>

        <div className="admin-sidebar-nav">
          {NAV.map((section) => (
            <div key={section.section} className="admin-nav-section">
              <div className="admin-nav-section-label">{section.section}</div>
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-nav-item ${pathname === item.href ? "active" : ""}`}
                >
                  <span className="admin-nav-item-icon">{item.icon}</span>
                  <span className="admin-nav-item-label">{item.label}</span>
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="admin-sidebar-footer">
          <button
            className="admin-nav-item signout-btn"
            onClick={handleLogout}
          >
            <span className="admin-nav-item-icon">{Icons.signout}</span>
            <span className="admin-nav-item-label">Sign out</span>
          </button>
        </div>
      </aside>

        {showLogoutModal && (
        <div className="modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon"><i className="fas fa-sign-out-alt"></i></div>
            <h3 className="modal-title">Sign Out</h3>
            <p className="modal-message">Are you sure you want to sign out of your admin account?</p>
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
        .admin-sidebar-toggle {
          display: none;
          position: fixed;
          top: 16px;
          right: 16px;
          z-index: 50;
          background: var(--black-2);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 10px;
          color: var(--white);
          cursor: pointer;
          transition: all 0.2s;
          width: 44px;
          height: 44px;
          align-items: center;
          justify-content: center;
        }
        .admin-sidebar-toggle:hover {
          background: var(--black-3);
          border-color: rgba(255,255,255,0.15);
        }

        .admin-sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(4px);
          z-index: 39;
        }

        .admin-sidebar {
          position: sticky;
          top: 0;
          height: 100vh;
          background: var(--black-2);
          border-right: 1px solid rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
          transition: width 0.3s ease, transform 0.3s ease;
          width: 280px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .admin-sidebar-logo {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 28px 24px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          flex-shrink: 0;
        }

        .admin-logo-mark {
          width: 40px;
          height: 40px;
          background: var(--yellow);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-weight: 800;
          color: var(--black);
          font-size: 20px;
          flex-shrink: 0;
        }

        .admin-sidebar-brand {
          font-family: var(--font-display);
          font-size: 18px;
          font-weight: 700;
          color: var(--white);
          letter-spacing: -0.02em;
          white-space: nowrap;
        }

        .admin-sidebar-nav {
          flex: 1;
          overflow-y: auto;
          padding: 20px 16px;
        }

        .admin-nav-section {
          margin-bottom: 20px;
        }
        .admin-nav-section:last-child {
          margin-bottom: 0;
        }

        .admin-nav-section-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--gray-4);
          padding: 0 8px;
          margin-bottom: 8px;
        }

        .admin-nav-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 14px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          color: var(--gray-3);
          transition: all 0.2s ease;
          cursor: pointer;
          text-decoration: none;
          margin-bottom: 2px;
        }
        .admin-nav-item:hover {
          background: rgba(255,255,255,0.04);
          color: var(--white);
        }
        .admin-nav-item.active {
          background: rgba(255,230,0,0.08);
          color: var(--yellow);
        }
        .admin-nav-item.active .admin-nav-item-icon {
          color: var(--yellow);
        }

        .admin-nav-item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          flex-shrink: 0;
          color: var(--gray-4);
          transition: color 0.2s;
        }
        .admin-nav-item:hover .admin-nav-item-icon {
          color: var(--gray-2);
        }
        .admin-nav-item.active .admin-nav-item-icon {
          color: var(--yellow);
        }

        .admin-nav-item-label {
          white-space: nowrap;
        }

        .admin-sidebar-footer {
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 16px 16px 24px;
          flex-shrink: 0;
        }

        .signout-btn {
          color: var(--gray-4);
          margin-bottom: 0;
        }
        .signout-btn:hover {
          color: #f87171 !important;
          background: rgba(239,68,68,0.08) !important;
        }
        .signout-btn:hover .admin-nav-item-icon {
          color: #f87171 !important;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(8px);
          z-index: 999;
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

        @media (max-width: 1024px) {
          .admin-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            z-index: 40;
            transform: translateX(-100%);
            width: 300px;
            height: 100vh;
            border-right: 1px solid rgba(255,255,255,0.06);
          }
          .admin-sidebar.mobile-open {
            transform: translateX(0);
          }
          .admin-sidebar-toggle {
            display: flex;
          }
          .admin-sidebar-logo {
            padding: 24px 24px;
          }
          .admin-sidebar-nav {
            padding: 20px 16px;
          }
          .admin-nav-item {
            padding: 14px 16px;
            font-size: 15px;
          }
          .admin-sidebar-footer {
            padding: 16px 16px 24px;
          }
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

        @media (min-width: 1025px) {
          .admin-sidebar-overlay {
            display: none !important;
          }
          .admin-sidebar.mobile-open {
            transform: none !important;
          }
        }

        .admin-sidebar-nav::-webkit-scrollbar {
          width: 4px;
        }
        .admin-sidebar-nav::-webkit-scrollbar-track {
          background: transparent;
        
        .admin-sidebar-nav::-webkit-scrollbar-thumb {
          background: var(--black-4);
          border-radius: 2px;
        }
        .admin-sidebar-nav::-webkit-scrollbar-thumb:hover {
          background: var(--gray-4);
        }
      `}</style>
    </>
  );
}