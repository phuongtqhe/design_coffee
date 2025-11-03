import React, { useState } from "react";
import {
  Button,
  Container,
  Form,
  Row,
  Col,
  Card,
  Alert,
} from "react-bootstrap";
import bgImage from "../images/background/bg_3.jpg";
import { useNavigate } from "react-router-dom";
import { EyeFill, EyeSlashFill } from "react-bootstrap-icons";
import bcrypt from "bcryptjs";

function SignUp() {
  const navigate = useNavigate();

  // ✅ Dữ liệu mặc định của người dùng mới
  const [formData, setFormData] = useState({
    id: "",
    userName: "",
    email: "",
    password: "",
    picture: "",
    phone: "",
    role: "customer",
    status: "active",
    address: {
      country: "",
      city: "",
      zipcode: "",
      street: "",
      detailAddress: "",
    },
    createdAt: "",
    updatedAt: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Cập nhật dữ liệu form (kể cả field trong address)
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (
        ["country", "city", "zipcode", "street", "detailAddress"].includes(name)
      ) {
        return {
          ...prev,
          address: { ...prev.address, [name]: value },
        };
      }
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!formData.userName || !formData.email || !formData.password) {
      setError("Vui lòng điền đầy đủ họ tên, email và mật khẩu!");
      return;
    }

    setLoading(true);
    try {
      // Kiểm tra email trùng
      const res = await fetch(
        `http://localhost:9999/users?email=${encodeURIComponent(
          formData.email
        )}`
      );
      const existing = await res.json();

      if (existing.length > 0) {
        setError("Email đã tồn tại! Vui lòng sử dụng email khác.");
        setLoading(false);
        return;
      }

      // 🔹 Lấy danh sách user để tạo ID tự động
      const allUsersRes = await fetch("http://localhost:9999/users");
      const allUsers = await allUsersRes.json();
      const nextId =
        allUsers.length > 0
          ? Math.max(...allUsers.map((u) => Number(u.id) || 0)) + 1
          : 1;

      // Hash mật khẩu
      const hashedPassword = await bcrypt.hash(formData.password, 10);

      const newUser = {
        ...formData,
        id: nextId.toString(), // ✅ ID là số dạng chuỗi
        password: hashedPassword,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Gửi dữ liệu mới lên server
      const postRes = await fetch("http://localhost:9999/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (postRes.ok) {
        setSuccess("Đăng ký thành công! Đang chuyển hướng...");
        setTimeout(() => navigate("/login"), 1000);
      } else {
        setError("Không thể tạo tài khoản. Vui lòng thử lại!");
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi kết nối đến server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center min-vh-100 bg-light"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Card
        className="p-4 shadow-lg"
        style={{
          maxWidth: "600px",
          width: "100%",
          borderRadius: "16px",
          backgroundColor: "rgba(255,255,255,0.9)",
        }}
      >
        <h2 className="text-center mb-4">Tạo tài khoản mới</h2>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Họ và tên</Form.Label>
            <Form.Control
              type="text"
              name="userName"
              placeholder="Nhập họ tên của bạn"
              value={formData.userName}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Nhập email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3 position-relative">
                <Form.Label>Mật khẩu</Form.Label>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <Button
                  variant="link"
                  className="p-0"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "38px",
                    color: "#6c757d",
                  }}
                >
                  {showPassword ? (
                    <EyeSlashFill size={20} />
                  ) : (
                    <EyeFill size={20} />
                  )}
                </Button>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  placeholder="0878-532-644"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Mã bưu điện</Form.Label>
                <Form.Control
                  type="text"
                  name="zipcode"
                  placeholder="90566-7771"
                  value={formData.address.zipcode}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Quốc gia</Form.Label>
                <Form.Control
                  type="text"
                  name="country"
                  placeholder="Việt Nam"
                  value={formData.address.country}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Thành phố</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  placeholder="Hà Nội"
                  value={formData.address.city}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Đường / Phố</Form.Label>
                <Form.Control
                  type="text"
                  name="street"
                  placeholder="Nguyễn Trãi"
                  value={formData.address.street}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Địa chỉ chi tiết</Form.Label>
            <Form.Control
              type="text"
              name="detailAddress"
              placeholder="Số 123, Chung cư ABC..."
              value={formData.address.detailAddress}
              onChange={handleChange}
            />
          </Form.Group>

          <Button
            variant="primary"
            type="button"
            className="w-100 mt-3"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </Button>

          <p className="text-center mt-3 mb-0">
            Đã có tài khoản?{" "}
            <Button
              variant="link"
              onClick={() => navigate("/login")}
              style={{ textDecoration: "none", color: "#0d6efd", padding: 0 }}
            >
              Đăng nhập
            </Button>
          </p>
        </Form>
      </Card>
    </Container>
  );
}

export default SignUp;
