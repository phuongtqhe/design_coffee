import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function useAuthentication() {
  const [user, setUser] = useState(() => {
    // ✅ Lấy user từ sessionStorage (nếu có)
    const data = sessionStorage.getItem("data");
    return data ? JSON.parse(data) : null;
  });

  const navigate = useNavigate();
  const location = useLocation();
  const isLogged = !!user;

  // ✅ Tự động điều hướng nếu đã login mà vào trang /login
  useEffect(() => {
    if (isLogged && location.pathname === "/login") {
      navigate("/");
    }
  }, [isLogged, location.pathname, navigate]);

  // ✅ Hàm cập nhật lại user (khi login hoặc logout)
  const refreshAuth = useCallback(() => {
    const data = sessionStorage.getItem("data");
    setUser(data ? JSON.parse(data) : null);
  }, []);

  const isAdmin = user?.role?.toLowerCase() === "admin";
  const role = user?.role || "";
  const name = user?.name || "";
  const currentUser = user || {};

  return {
    isLogged,
    isAdmin,
    role,
    name,
    currentUser,
    refreshAuth, // ✅ thêm hàm này để UserMenu gọi khi logout/login
  };
}
