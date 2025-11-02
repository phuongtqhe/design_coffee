import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import bgImage from "../images/background/bg_1.jpg";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Login: handleLogin (thay thế nguyên hàm của bạn)
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!emailOrPhone || !password) {
      toast.warning("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:9999/users");
      const users = await res.json();

      const input = emailOrPhone.trim().toLowerCase();

      const foundUser = users.find((u) => {
        const uEmail = u.email ? String(u.email).trim().toLowerCase() : "";
        const uId = u.id ? String(u.id).trim().toLowerCase() : "";
        const uPhone = u.phone ? String(u.phone).trim() : "";
        return (
          uEmail === input || uId === input || uPhone === emailOrPhone.trim()
        );
      });

      if (!foundUser) {
        toast.error("Không tìm thấy tài khoản!");
        setLoading(false);
        return;
      }

      // debug: kiểm tra stored password (optional, xóa khi ổn)
      // console.log("stored password:", foundUser.password);

      // Nếu password tồn tại và là hash bcrypt (bắt đầu bằng $2)
      const isBcryptHash =
        typeof foundUser.password === "string" &&
        /^\$2[aby]\$/.test(foundUser.password);

      const passwordMatch = isBcryptHash
        ? await bcrypt.compare(password, foundUser.password)
        : password === foundUser.password;

      if (!passwordMatch) {
        toast.error("Sai mật khẩu!");
        setLoading(false);
        return;
      }

      sessionStorage.setItem(
        "data",
        JSON.stringify({
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.userName,
          role: foundUser.role,
          phone: foundUser.phone,
        })
      );

      toast.success("Đăng nhập thành công!");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi đăng nhập!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google Login — có role, tự thêm user mới nếu chưa có
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const res = await fetch("http://localhost:9999/users");
      const users = await res.json();
      let foundUser = users.find((u) => u.email === decoded.email);

      if (!foundUser) {
        const newUser = {
          id: decoded.email,
          email: decoded.email,
          name: decoded.name,
          picture: decoded.picture,
          role: "customer",
        };

        await fetch("http://localhost:9999/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        });

        foundUser = newUser;
        toast.info("Tài khoản Google mới đã được thêm vào hệ thống!");
      }

      // Lưu có role vào sessionStorage
      sessionStorage.setItem(
        "data",
        JSON.stringify({
          email: foundUser.email,
          name: foundUser.name,
          picture: foundUser.picture,
          role: foundUser.role,
        })
      );

      toast.success("Đăng nhập Google thành công!");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Đăng nhập Google thất bại!");
    }
  };

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
            <Form onSubmit={handleLogin}>
              <fieldset disabled={loading}>
                <Form.Group className="mb-3">
                  <Form.Label>Email hoặc số điện thoại</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập thông tin đăng nhập"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Mật khẩu</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Check
                  type="switch"
                  label="Ghi nhớ tài khoản cho lần sử dụng sau"
                  className="mb-3"
                />

                <Button
                  variant="primary"
                  className="w-100 mb-3"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>
              </fieldset>

              {/* Separator */}
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

              {/* ✅ Google Login (đã sửa) */}
              <div className="mb-3" style={{ padding: "10px 0" }}>
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => toast.error("Đăng nhập Google thất bại!")}
                />
              </div>

              <Button
                variant="outline-secondary"
                className="w-100 mb-3"
                onClick={() => navigate("/signup")}
              >
                Đăng ký tài khoản mới
              </Button>

              <p className="text-center mb-0">Bạn quên thông tin tài khoản?</p>
              <p className="text-center">
                <Button
                  variant="link"
                  onClick={() => navigate("/reset-password")}
                  style={{
                    textDecoration: "none",
                    color: "#0d6efd",
                    padding: 0,
                  }}
                >
                  Quên mật khẩu
                </Button>
              </p>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;
