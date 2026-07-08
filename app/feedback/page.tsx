"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSession } from "next-auth/react";
import { useState } from "react";

const CATEGORIES = [
  "App experience",
  "Driver behavior",
  "Ride quality",
  "Pricing",
  "Support",
  "Other",
];

export default function FeedbackPage() {
  const { data: session } = useSession();

  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (rating === 0) {
      setError("Please select a star rating before submitting.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          category,
          message,
         
        }),
      });

      if (!res.ok) throw new Error("Failed to submit");

      setSuccess(true);
      setRating(0);
      setCategory("");
      setMessage("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="feedback-page">
        <div className="container">

          <div style={{ maxWidth: 600 }}>
            <p className="section-label">Feedback</p>
            <h1 className="page-hero-title" style={{ fontSize: "clamp(32px, 4vw, 56px)", textAlign: "left" }}>
              Tell us what<br />
              <span style={{ color: "var(--yellow)" }}>you think</span>
            </h1>
            <p style={{ color: "var(--gray-3)", fontSize: 16, marginTop: 12, lineHeight: 1.7 }}>
              Your feedback goes directly to the team 
            </p>
          </div>

          <div className="feedback-grid">

            
            <div className="feedback-info">
              <h3>Other ways to reach us</h3>
              <p>Use the form or contact us directly. We reply within 24 hours.</p>

              <div className="feedback-channels">
                <div className="feedback-channel">
                 <div className="feedback-channel-icon"><i className="fas fa-envelope"></i></div>
                    <div>
                      <div className="feedback-channel-name">Email</div>
                      <div className="feedback-channel-sub">support@yalla.app</div>
                    </div>
                  </div>  
              </div>
            </div>

          
            <div className="feedback-form-card">

              {success ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ fontSize: 56, marginBottom: 16 }}><i className="fas fa-check-circle"></i></div>
                  <h3 style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 22, fontWeight: 800, marginBottom: 8,
                  }}>
                    Thank you!
                  </h3>
                  <p style={{ color: "var(--gray-3)", lineHeight: 1.6 }}>
                    Your feedback has been sent to the Yalla team.
                  </p>
                  <button
                    className="btn-submit"
                    style={{ marginTop: 24, width: "auto", padding: "12px 28px" }}
                    onClick={() => setSuccess(false)}
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>

                  {error && <div className="form-error">{error}</div>}

                  <div className="form-group">
                    <label className="form-label">Overall rating</label>
                    <div className="star-picker">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={`star-btn ${star <= (hovered || rating) ? "active" : ""}`}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHovered(star)}
                          onMouseLeave={() => setHovered(0)}
                          aria-label={`Rate ${star} stars`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="category">Category</label>
                    <select
                      id="category"
                      className="form-select"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    >
                      <option value="" disabled>Select a category…</option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="message">Your message</label>
                    <textarea
                      id="message"
                      className="form-textarea"
                      placeholder="What went well? What could be better?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      minLength={10}
                    />
                  </div>

                  {session?.user && (
                    <p style={{ fontSize: 12, color: "var(--gray-3)", marginBottom: 16 }}>
                      Submitting as{" "}
                      <strong style={{ color: "var(--white)" }}>
                        {session.user.name || session.user.email}
                      </strong>
                    </p>
                  )}

                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={submitting}
                  >
                    {submitting ? "Sending…" : "Send feedback"}
                  </button>

                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}