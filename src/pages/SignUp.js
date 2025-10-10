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

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: {
      country: "",
      state: "",
      city: "",
      detailAddress: "",
      zipcode: "",
    },
    role: "User",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Xử lý khi người dùng nhập dữ liệu
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      ["country", "state", "city", "detailAddress", "zipcode"].includes(name)
    ) {
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Gửi dữ liệu đến json-server
  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    try {
      // Kiểm tra email đã tồn tại chưa
      const res = await fetch(
        `http://localhost:9999/users?email=${formData.email}`
      );
      const existing = await res.json();

      if (existing.length > 0) {
        setError("Email đã tồn tại! Vui lòng sử dụng email khác.");
        return;
      }

      // Tạo user mới
      const newUser = {
        ...formData,
        id: formData.email, // dùng email làm id cho dễ truy xuất
      };

      const postRes = await fetch("http://localhost:9999/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (postRes.ok) {
        setSuccess("Đăng ký thành công! Đang chuyển hướng...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError("Không thể tạo tài khoản. Vui lòng thử lại!");
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi kết nối đến server!");
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
              name="name"
              placeholder="Nhập họ tên của bạn"
              value={formData.name}
              onChange={handleChange}
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
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                />
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
                  placeholder="US"
                  value={formData.address.country}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Bang / Tỉnh</Form.Label>
                <Form.Control
                  type="text"
                  name="state"
                  placeholder="Arizona"
                  value={formData.address.state}
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
                  placeholder="Wisokyburgh"
                  value={formData.address.city}
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
              placeholder="Victor Plains"
              value={formData.address.detailAddress}
              onChange={handleChange}
            />
          </Form.Group>

          <Button
            variant="primary"
            type="button"
            className="w-100 mt-3"
            onClick={handleSubmit}
          >
            Đăng ký
          </Button>

          <p className="text-center mt-3 mb-0">
            Đã có tài khoản?{" "}
            <a href="/login" style={{ textDecoration: "none" }}>
              Đăng nhập
            </a>
          </p>
        </Form>
      </Card>
    </Container>
  );
}

export default SignUp;
