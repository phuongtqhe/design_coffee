// src/pages/FeedbackAdmin.js
import React, { useEffect, useState } from "react";

const FeedbackAdmin = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  const fetchFeedbacks = async () => {
    const res = await fetch("http://localhost:3001/feedbacks");
    const data = await res.json();
    setFeedbacks(data);
  };

  const handleReplyChange = (id, value) => {
    setFeedbacks(feedbacks.map(f => f.id === id ? { ...f, reply: value } : f));
  };

  const handleSaveReply = async (id, reply) => {
    await fetch(`http://localhost:3001/feedbacks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply }),
    });
    alert("Reply saved!");
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Customer Feedback Management</h2>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>Reply</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map(f => (
            <tr key={f.id}>
              <td>{f.id}</td>
              <td>{f.userId}</td>
              <td>{f.rating} ★</td>
              <td>{f.comment}</td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  value={f.reply || ""}
                  onChange={(e) => handleReplyChange(f.id, e.target.value)}
                />
              </td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => handleSaveReply(f.id, f.reply)}
                >
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeedbackAdmin;
