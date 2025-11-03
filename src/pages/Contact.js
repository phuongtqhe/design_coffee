import React, { useEffect, useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(0);

  useEffect(() => {
    fetch("http://localhost:9999/stores")
      .then((res) => res.json())
      .then((data) => setBranches(data));
  }, []);

  const currentBranch = branches[selectedBranch] || {};

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:9999/feedbacks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    alert("Cảm ơn bạn đã gửi tin nhắn! Chúng tôi sẽ phản hồi sớm nhất.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3">Liên hệ với chúng tôi</h1>
        <p className="lead text-muted mb-4">
          Bạn cần hỗ trợ, muốn hỏi thêm về cà phê, hoặc đơn giản chỉ muốn gửi
          lời chào?
        </p>
      </div>

      {/* chọn chi nhánh */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="mb-3">
            <i className="fas fa-store me-2 text-primary"></i>Chọn chi nhánh gần
            bạn
          </h5>
          <div className="btn-group w-100">
            {branches.map((br, i) => (
              <button
                key={br.id}
                className={`btn ${
                  selectedBranch === i ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => setSelectedBranch(i)}
              >
                {br.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {branches.length > 0 && (
        <div className="row mb-4">
          <div className="col-lg-7 mb-4">
            <div className="card shadow-sm h-100">
              <iframe
                src={currentBranch.mapUrl}
                width="100%"
                height="450"
                style={{ border: 0 }}
                loading="lazy"
                title={currentBranch.name}
              ></iframe>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="card shadow-sm h-100 p-4">
              <h3 className="mb-4">
                <i className="fas fa-info-circle me-2 text-primary"></i>
                {currentBranch.name}
              </h3>
              <p>
                <i className="fas fa-map-marker-alt text-primary me-2"></i>
                <strong>Địa chỉ:</strong> {currentBranch.address},{" "}
                {currentBranch.city}
              </p>
              <p>
                <i className="fas fa-phone text-primary me-2"></i>
                <strong>Điện thoại:</strong>{" "}
                <a href={`tel:${currentBranch.phone}`}>{currentBranch.phone}</a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* form */}
      <div className="col-lg-8 mx-auto">
        <div className="card shadow-sm p-4">
          <h3 className="text-center mb-3">
            <i className="fas fa-paper-plane me-2 text-primary"></i>Gửi tin nhắn
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="fw-bold">Họ tên *</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="fw-bold">Email *</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="fw-bold">Chủ đề *</label>
              <input
                type="text"
                className="form-control"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label className="fw-bold">Nội dung *</label>
              <textarea
                className="form-control"
                name="message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>

            <button className="btn btn-primary btn-lg w-100">
              <i className="fas fa-paper-plane me-2"></i>Gửi tin nhắn
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
