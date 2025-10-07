import React from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import bgImage from "../images/background/bg_1.jpg";

function Login() {
  return (
    <div
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <Container
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: "20px",
          padding: "40px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          maxWidth: "900px",
        }}
      >
        <Row className="align-items-center">
          <Col
            xs={12}
            md={6}
            className="mb-4 mb-md-0 text-center text-md-start"
          >
            <h1
              style={{
                fontWeight: "700",
                fontSize: "2.5rem",
                lineHeight: "1.2",
                marginBottom: "20px",
              }}
            >
              Chào mừng <br /> quý khách
            </h1>
            <p style={{ fontSize: "1.1rem", color: "#555" }}>
              Quán cà phê chúng tôi luôn luôn hoan nghênh những vị khách hàng
              thân thiết của mình quay trở lại.
            </p>
          </Col>

          <Col xs={12} md={6}>
            <h2 style={{ fontWeight: "600", marginBottom: "20px" }}>
              Đăng nhập
            </h2>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>
                  Email hoặc tên người dùng hoặc số điện thoại
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Nhập thông tin đăng nhập"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Mật khẩu</Form.Label>
                <Form.Control type="password" placeholder="Nhập mật khẩu" />
              </Form.Group>
              <Form.Check
                type="switch"
                label="Ghi nhớ tài khoản cho lần sử dụng sau"
                className="mb-3"
              />
              <Button variant="primary" className="w-100 mb-3">
                Đăng nhập
              </Button>
              <div
                className="text-center mb-3"
                style={{ position: "relative" }}
              >
                <hr />
                <span
                  style={{
                    background: "#fff",
                    padding: "0 10px",
                    position: "absolute",
                    top: "-12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    color: "#555",
                  }}
                >
                  Hoặc
                </span>
              </div>
              <Button variant="danger" className="w-100 mb-3">
                Đăng nhập bằng tài khoản Google
              </Button>

              <Button
                variant="outline-secondary"
                className="w-100 mb-3"
                href="/signup"
              >
                Đăng ký tài khoản mới
              </Button>

              <p className="text-center mb-0">Bạn quên thông tin tài khoản?</p>
              <p className="text-center">
                <a
                  href="/reset-password"
                  style={{ textDecoration: "none", color: "#0d6efd" }}
                >
                  Quên mật khẩu
                </a>
              </p>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;
