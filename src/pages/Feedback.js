import React, { useState } from "react";

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [feedbackHistory, setFeedbackHistory] = useState([]);

  const userId = JSON.parse(sessionStorage.getItem("data"))?.email || "guest@example.com";

  // Gửi feedback mới
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const newFeedback = {
      userId,
      rating,
      comment,
      reply: "",
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch("http://localhost:9999/feedbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFeedback),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      setMessage("✅ Feedback sent successfully!");
      setRating(0);
      setComment("");
    } catch (err) {
      console.error("❌ Error sending feedback:", err);
      setMessage("❌ Failed to send feedback. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Hiển thị lịch sử feedback
  const handleShowHistory = async () => {
    try {
      const res = await fetch(`http://localhost:9999/feedbacks?userId=${userId}`);
      const data = await res.json();
      setFeedbackHistory(data);
      setShowHistory(!showHistory);
    } catch (error) {
      console.error("Error fetching feedback history:", error);
      setMessage("❌ Failed to load history.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "700px" }}>
      <h2 className="text-center mb-4">Customer Feedback</h2>

      <form onSubmit={handleSubmit}>
        {/* Rating Stars */}
        <div className="mb-3 text-center">
          {[...Array(5)].map((_, index) => {
            const currentRating = index + 1;
            return (
              <span
                key={index}
                style={{
                  fontSize: "2rem",
                  color:
                    currentRating <= (hover || rating)
                      ? "#ffc107"
                      : "#e4e5e9",
                  cursor: "pointer",
                }}
                onClick={() => setRating(currentRating)}
                onMouseEnter={() => setHover(currentRating)}
                onMouseLeave={() => setHover(rating)}
              >
                ★
              </span>
            );
          })}
        </div>

        {/* Comment box */}
        <div className="mb-3">
          <label className="form-label">Your Comment:</label>
          <textarea
            className="form-control"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            placeholder="Write your feedback..."
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="d-flex flex-column gap-3">
          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Feedback"}
          </button>

          <button
            type="button"
            className="btn btn-outline-primary w-100"
            onClick={handleShowHistory}
          >
            {showHistory ? "Hide History" : "History List"}
          </button>
        </div>

        {/* Message */}
        {message && (
          <p
            className={`mt-3 text-center ${
              message.startsWith("✅") ? "text-success" : "text-danger"
            }`}
          >
            {message}
          </p>
        )}
      </form>

      {/* History Table */}
      {showHistory && (
        <div className="mt-4">
          <h4 className="text-center mb-3">Your Feedback History</h4>
          {feedbackHistory.length === 0 ? (
            <p className="text-center text-muted">No feedback found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-bordered align-middle text-center">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>Created At</th>
                    <th>Reply</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbackHistory.map((fb, index) => (
                    <tr key={fb.id}>
                      <td>{index + 1}</td>
                      <td>{fb.rating} ★</td>
                      <td>{fb.comment}</td>
                      <td>
                        {new Date(fb.createdAt).toLocaleString("en-GB", {
                          hour12: false,
                        })}
                      </td>
                      <td>{fb.reply || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Feedback;
