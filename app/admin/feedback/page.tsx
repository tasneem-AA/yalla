"use client";

import { useEffect, useState } from "react";

type FeedbackItem = {
  id: number;
  rating: number;
  category: string;
  message: string;
  userName?: string;
  userEmail?: string;
  createdAt: string;
};

export default function AdminFeedbackPage() {
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<FeedbackItem | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<FeedbackItem | null>(null);

  useEffect(() => {
    fetch("/api/feedback")
      .then((r) => r.json())
      .then((data) => {
        setItems(data.feedback ?? []);
        setLoading(false);
      })
      .catch(() => {
        setItems([]);
        setLoading(false);
      });
  }, []);

 
  const handleDeleteClick = (item: FeedbackItem) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    setDeleting(itemToDelete.id);
    try {
      await fetch(`/api/feedback?id=${itemToDelete.id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((item) => item.id !== itemToDelete.id));
      if (selected?.id === itemToDelete.id) setSelected(null);
    } catch {
      alert("Failed to delete.");
    } finally {
      setDeleting(null);
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const filtered = items.filter((item) =>
    !search ||
    item.message.toLowerCase().includes(search.toLowerCase()) ||
    item.userName?.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  const avgRating = items.length
    ? (items.reduce((s, i) => s + i.rating, 0) / items.length).toFixed(1)
    : "—";

  return (
    <>
      <h1 className="admin-page-title">Feedback</h1>
      <p className="admin-page-sub">All user feedback submissions. Click a row to read the full message.</p>

      <div className="admin-kpi-row">
        <div className="kpi-card">
          <div className="kpi-label">Total submissions</div>
          <div className="kpi-value" style={{ fontSize: 28 }}>{items.length}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Avg rating</div>
          <div className="kpi-value" style={{ fontSize: 28, color: "var(--yellow)" }}>{avgRating}★</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">5-star reviews</div>
          <div className="kpi-value" style={{ fontSize: 28, color: "#4ade80" }}>
            {items.filter((i) => i.rating === 5).length}
          </div>
        </div>
      </div>

      <div className="admin-search">
        <input
          className="admin-search-input"
          placeholder="Search by user, category, or message…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 380px" : "1fr", gap: 20 }}>

        <div className="admin-table-card">
          {loading ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--gray-3)" }}>Loading…</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Rating</th>
                  <th>Category</th>
                  <th>From</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    style={{ cursor: "pointer", background: selected?.id === item.id ? "rgba(255,230,0,0.04)" : undefined }}
                    onClick={() => setSelected(item)}
                  >
                    <td>
                      <span style={{ color: "var(--yellow)" }}>{"★".repeat(item.rating)}</span>
                    </td>
                    <td><span className="badge badge-gray">{item.category}</span></td>
                    <td>{item.userName ?? "Anonymous"}</td>
                    <td style={{ color: "var(--gray-3)" }}>
                      {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </td>
                    <td>
                      <button
                        className="btn-sm btn-sm-red"
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleDeleteClick(item);
                        }}
                        disabled={deleting === item.id}
                      >
                        {deleting === item.id ? "…" : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

       
        {selected && (
          <div className="admin-table-card" style={{ padding: 28, alignSelf: "start" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Full message</h3>
              <button onClick={() => setSelected(null)} style={{ color: "var(--gray-3)", fontSize: 20, lineHeight: 1 }}>×</button>
            </div>

            <div style={{ marginBottom: 12 }}>
              <span style={{ color: "var(--yellow)" }}>{"★".repeat(selected.rating)}</span>
              <span style={{ marginLeft: 8 }} className="badge badge-gray">{selected.category}</span>
            </div>

            <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--gray-2)", marginBottom: 20 }}>
              &ldquo;{selected.message}&rdquo;
            </p>

            <div style={{ fontSize: 13, color: "var(--gray-3)", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
              <div><strong style={{ color: "var(--white)" }}>{selected.userName ?? "Anonymous"}</strong></div>
              {selected.userEmail && <div>{selected.userEmail}</div>}
              <div style={{ marginTop: 4 }}>{new Date(selected.createdAt).toLocaleString("en-US")}</div>
            </div>
          </div>
        )}
      </div>

      
      {showDeleteModal && itemToDelete && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon"><i className="fas fa-trash-alt"></i></div>
            <h3 className="modal-title">Delete Feedback</h3>
            <p className="modal-message">
              Are you sure you want to delete this feedback from <strong>{itemToDelete.userName || "Anonymous"}</strong>?
              <br />
              <span style={{ fontSize: 12, color: "var(--gray-4)" }}>This action cannot be undone.</span>
            </p>
            <div className="modal-actions">
              <button 
                className="modal-btn modal-btn-cancel"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="modal-btn modal-btn-danger"
                onClick={confirmDelete}
              >
                Delete
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
          max-width: 420px;
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
        .modal-message strong {
          color: var(--white);
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