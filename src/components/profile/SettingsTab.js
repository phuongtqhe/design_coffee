import React, { useState, useEffect } from "react";
import { Card, Form, Button, InputGroup } from "react-bootstrap";
import { FaLock, FaEye, FaEyeSlash, FaTrash } from "react-icons/fa";
import bcrypt from "bcryptjs";
import { toast } from "react-toastify";

function SettingsTab() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [user, setUser] = useState(null);

  // 🔹 Lấy user hiện tại từ sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 🔹 Xử lý đổi mật khẩu
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!user) return toast.error("No user logged in");

    const { currentPassword, newPassword, confirmPassword } = formData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.warning("Please fill in all fields");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match");
    }

    try {
      // 🔸 Lấy user từ db.json
      const res = await fetch(`http://localhost:3000/users/${user.id}`);
      if (!res.ok) throw new Error("Failed to fetch user");
      const userData = await res.json();

      // 🔸 Kiểm tra mật khẩu cũ (bỏ qua nếu user đăng nhập bằng Google)
      if (userData.password && userData.password.length > 0) {
        const valid = await bcrypt.compare(currentPassword, userData.password);
        if (!valid) return toast.error("Current password is incorrect");
      } else {
        return toast.error("Password cannot be changed for Google accounts");
      }

      // 🔸 Hash mật khẩu mới
      const hashed = await bcrypt.hash(newPassword, 10);

      // 🔸 Cập nhật vào db.json
      await fetch(`http://localhost:3000/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: hashed,
          updatedAt: new Date().toISOString(),
        }),
      });

      toast.success("Password updated successfully!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Error updating password");
    }
  };

  // 🔹 Xử lý xóa tài khoản
  const handleDeleteAccount = async () => {
    if (!user) return toast.error("No user logged in");

    if (!window.confirm("Are you sure you want to delete your account?"))
      return;

    try {
      await fetch(`http://localhost:3000/users/${user.id}`, {
        method: "DELETE",
      });
      toast.success("Account deleted successfully");

      sessionStorage.removeItem("user");
      window.location.href = "/"; // chuyển về trang chủ
    } catch (err) {
      toast.error("Error deleting account");
    }
  };

  return (
    <>
      {/* 🔐 Change Password */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <h5 className="fw-bold mb-4">
            <FaLock className="me-2 text-secondary" />
            Change Password
          </h5>

          <Form onSubmit={handleChangePassword}>
            {/* Current Password */}
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword.current ? "text" : "password"}
                  placeholder="********"
                  value={formData.currentPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentPassword: e.target.value,
                    })
                  }
                />
                <Button
                  variant="outline-secondary"
                  onClick={() =>
                    setShowPassword({
                      ...showPassword,
                      current: !showPassword.current,
                    })
                  }
                >
                  {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
            </Form.Group>

            {/* New Password */}
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword.new ? "text" : "password"}
                  placeholder="********"
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                />
                <Button
                  variant="outline-secondary"
                  onClick={() =>
                    setShowPassword({
                      ...showPassword,
                      new: !showPassword.new,
                    })
                  }
                >
                  {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
            </Form.Group>

            {/* Confirm New Password */}
            <Form.Group className="mb-4">
              <Form.Label>Confirm New Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword.confirm ? "text" : "password"}
                  placeholder="********"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
                <Button
                  variant="outline-secondary"
                  onClick={() =>
                    setShowPassword({
                      ...showPassword,
                      confirm: !showPassword.confirm,
                    })
                  }
                >
                  {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
            </Form.Group>

            <Button variant="secondary" className="w-100" type="submit">
              Update Password
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* ⚠️ Danger Zone */}
      <Card
        className="border-0 shadow-sm"
        style={{ backgroundColor: "#f8d7da", border: "1px solid #f5c2c7" }}
      >
        <Card.Body>
          <h6 className="fw-bold text-danger">
            <FaTrash className="me-2" />
            Danger Zone
          </h6>
          <p className="text-muted mb-3">
            Once you delete your account, there is no going back.
          </p>
          <Button
            variant="danger"
            className="w-100"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </Button>
        </Card.Body>
      </Card>
    </>
  );
}

export default SettingsTab;
