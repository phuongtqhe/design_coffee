import React, { useEffect, useState } from "react";

const FeedbackAdmin = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // 🟢 Lấy toàn bộ feedback từ db.json
  const fetchFeedbacks = async () => {
    try {
      const res = await fetch("http://localhost:9999/feedbacks");
      if (!res.ok) throw new Error("Failed to load feedbacks");
      const data = await res.json();

      // Sắp xếp theo thời gian mới nhất
      const sorted = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setFeedbacks(sorted);
      setLoading(false);
    } catch (err) {
      console.error("❌ Error fetching feedbacks:", err);
      setMessage("❌ Failed to load feedbacks. Please check server connection.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // 🟡 Xử lý khi admin nhập phản hồi
  const handleReplyChange = (id, value) => {
    setFeedbacks((prev) =>
      prev.map((f) => (f.id === id ? { ...f, reply: value } : f))
    );
  };

  // 🔵 Lưu phản hồi vào db.json
  const handleSaveReply = async (id, reply) => {
    try {
      const res = await fetch(`http://localhost:9999/feedbacks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply }),
      });

      if (!res.ok) throw new Error("Failed to save reply");

      setMessage("✅ Reply saved successfully!");
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      console.error("❌ Error saving reply:", err);
      setMessage("❌ Failed to save reply. Please try again.");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading feedbacks...</p>;

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Customer Feedback Management</h2>

      {message && (
        <div
          className={`alert ${
            message.startsWith("✅") ? "alert-success" : "alert-danger"
          } text-center`}
        >
          {message}
        </div>
      )}

      {feedbacks.length === 0 ? (
        <p className="text-center">No feedbacks available.</p>
      ) : (
        <table className="table table-bordered table-striped">
          <thead className="table-light">
            <tr>
              <th style={{ width: "60px" }}>#</th>
              <th>User</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Reply</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((f, index) => (
              <tr key={f.id}>
                <td>{index + 1}</td>
                <td>{f.userId}</td>
                <td>{f.rating} ★</td>
                <td>{f.comment}</td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    value={f.reply || ""}
                    placeholder="Write a reply..."
                    onChange={(e) => handleReplyChange(f.id, e.target.value)}
                  />
                </td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleSaveReply(f.id, f.reply)}
                  >
                    Save
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FeedbackAdmin;
