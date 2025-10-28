import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";
import bcrypt from "bcryptjs";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: nhập email, 2: nhập OTP, 3: đặt lại mật khẩu
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  // Gửi OTP
  const handleSendOtp = async () => {
    if (!email) return toast.error("Vui lòng nhập gmail đã đăng ký của bạn");

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      await emailjs.send(
        "service_g6cn92c", // Service ID
        "template_jkox1cb", // Template ID
        {
          email: email,
          otp: generatedOtp,
          user_name: email.split("@")[0],
        },
        "H_eCwytvgAndq2sCI" // Public Key
      );

      sessionStorage.setItem("otp", generatedOtp);
      sessionStorage.setItem("otp_email", email);
      toast.success("OTP đã được gửi tới email của bạn!");
      setStep(2);
    } catch (error) {
      console.error(error);
      toast.error("Không thể gửi OTP. Vui lòng thử lại sau.");
    }
  };

  // Xác thực OTP
  const handleVerifyOtp = () => {
    const savedOtp = sessionStorage.getItem("otp");
    const savedEmail = sessionStorage.getItem("otp_email");

    if (otp === savedOtp && email === savedEmail) {
      toast.success("Xác minh OTP thành công!");
      setStep(3);
    } else {
      toast.error("OTP không hợp lệ hoặc email không khớp!");
    }
  };

  // Đặt lại mật khẩu
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword)
      return toast.error("Vui lòng nhập đầy đủ mật khẩu mới");
    if (newPassword !== confirmPassword)
      return toast.error("Mật khẩu xác nhận không khớp");

    try {
      const res = await axios.get(`http://localhost:9999/users?email=${email}`);
      if (res.data.length === 0)
        return toast.error("Không tìm thấy người dùng nào với email này");

      const user = res.data[0];
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await axios.patch(`http://localhost:9999/users/${user.id}`, {
        password: hashedPassword,
        updatedAt: new Date().toISOString(),
      });

      toast.success(
        "Mật khẩu đã được cập nhật thành công! Chuyển hướng về trang đăng nhập..."
      );
      sessionStorage.clear();
      setStep(1);
      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");

      // ✅ Chuyển về trang Login sau 2 giây
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error(error);
      toast.error("Đặt lại mật khẩu thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div
      className="p-4 shadow-sm rounded-3"
      style={{
        maxWidth: "420px",
        margin: "50px auto",
        backgroundColor: "#f8f9fa",
      }}
    >
      <h4 className="mb-4 text-center fw-bold text-secondary">Quên mật khẩu</h4>

      {step === 1 && (
        <>
          <label className="form-label">Nhập email đã đăng ký</label>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="yourname@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="btn btn-secondary w-100" onClick={handleSendOtp}>
            Gửi mã OTP
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <label className="form-label">Nhập mã OTP đã nhận</label>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="6 số OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button className="btn btn-dark w-100" onClick={handleVerifyOtp}>
            Xác nhận OTP
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <label className="form-label">Mật khẩu mới</label>
          <input
            type="password"
            className="form-control mb-2"
            placeholder="Nhập mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <label className="form-label mt-2">Xác nhận mật khẩu</label>
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            className="btn btn-success w-100"
            onClick={handleResetPassword}
          >
            Đặt lại mật khẩu
          </button>
        </>
      )}
    </div>
  );
}

export default ForgotPassword;
