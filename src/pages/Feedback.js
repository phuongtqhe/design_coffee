import React, { useState } from "react";

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [userId, setUserId] = useState(localStorage.getItem("userEmail") || "guest@example.com");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newFeedback = {
      userId,
      rating,
      comment,
      reply: ""
    };

    await fetch("http://localhost:3001/feedbacks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newFeedback),
    });

    alert("Feedback sent successfully!");
    setRating(0);
    setComment("");
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h2 className="text-center mb-4">Customer Feedback</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3 text-center">
          {[...Array(5)].map((star, index) => {
            const currentRating = index + 1;
            return (
              <span
                key={index}
                style={{
                  fontSize: "2rem",
                  color: currentRating <= (hover || rating) ? "#ffc107" : "#e4e5e9",
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
        <button type="submit" className="btn btn-success w-100">Send Feedback</button>
      </form>
    </div>
  );
};

export default Feedback;
