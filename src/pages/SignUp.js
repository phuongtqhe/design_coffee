import React from "react";
import { Button, Container, Form, Row, Col, Card } from "react-bootstrap";
import bgImage from "../images/background/bg_3.jpg";

function SignUp() {
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
      <Card className="p-4 shadow-lg" style={{ maxWidth: "600px", width: "100%", borderRadius: "16px", backgroundColor: "rgba(255,255,255,0.9)" }}>
        <h2 className="text-center mb-4">Tạo tài khoản mới</h2>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Họ và tên</Form.Label>
            <Form.Control type="text" placeholder="Nhập họ tên của bạn" />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Nhập email" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Mật khẩu</Form.Label>
                <Form.Control type="password" placeholder="Nhập mật khẩu" />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control type="text" placeholder="0878-532-644" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Mã bưu điện</Form.Label>
                <Form.Control type="text" placeholder="90566-7771" />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Quốc gia</Form.Label>
                <Form.Control type="text" placeholder="US" />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Bang / Tỉnh</Form.Label>
                <Form.Control type="text" placeholder="Arizona" />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Thành phố</Form.Label>
                <Form.Control type="text" placeholder="Wisokyburgh" />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Địa chỉ chi tiết</Form.Label>
            <Form.Control type="text" placeholder="Victor Plains" />
          </Form.Group>

          <Button variant="primary" type="button" className="w-100 mt-3">
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
