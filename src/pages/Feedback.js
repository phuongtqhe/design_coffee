import React, { useState } from "react";

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const newFeedback = {
      userId: localStorage.getItem("userEmail") || "guest@example.com",
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

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h2 className="text-center mb-4">Customer Feedback</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3 text-center">
          {[...Array(5)].map((_, index) => {
            const currentRating = index + 1;
            return (
              <span
                key={index}
                style={{
                  fontSize: "2rem",
                  color: currentRating <= (hover || rating)
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

        <button
          type="submit"
          className="btn btn-success w-100"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Feedback"}
        </button>

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
    </div>
  );
};

export default Feedback;
