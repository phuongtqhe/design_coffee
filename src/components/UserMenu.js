import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthentication } from "../utils/use-authentication";
import { useCart } from "./CartContext";
import userIcon from "../images/user.svg";
import wishlistIcon from "../images/wishlist.svg";
import compareIcon from "../images/compare.svg";
import cartIcon from "../images/cart.svg";
import { BiLogOut, BiUser } from "react-icons/bi";
import { PiUserCircleDuotone } from "react-icons/pi";
import { FaUser } from "react-icons/fa6";
import { FaUserAlt } from "react-icons/fa";

const btnStyle = {
  background: "linear-gradient(135deg, #ffffff, #f8f9fa)",
  border: "2px solid #e9ecef",
  color: "#495057",
  fontWeight: "600",
  borderRadius: "20px",
  transition: "all 0.3s ease",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
};

const UserMenu = () => {
  const navigate = useNavigate();
  const { isLogged, currentUser, refreshAuth } = useAuthentication();
  const { cartCount } = useCart();
  const [thisUser, setThisUser] = useState(null);

  // ✅ Lấy user từ DB hoặc tạo mới nếu chưa có (Google login lần đầu)
  const fetchOrCreateUser = async (userData) => {
    if (!userData?.email) return;

    try {
      const emailParam = encodeURIComponent(userData.email);
      const res = await fetch(
        `http://localhost:9999/users?email=${emailParam}`
      );
      const users = await res.json();

      if (users.length > 0) {
        // ✅ User đã tồn tại → sử dụng user đó
        setThisUser(users[0]);
      } else {
        // ✅ User chưa có → tạo mới (id để JSON Server tự sinh)
        const newUser = {
          email: userData.email,
          name: userData.name || "Guest User",
          picture: userData.picture || "",
          role: "customer",
        };

        const createRes = await fetch("http://localhost:9999/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        });

        if (createRes.ok) {
          const createdUser = await createRes.json(); // JSON Server trả về user kèm id
          setThisUser(createdUser);
          toast.info("Tài khoản Google mới đã được tạo tự động!");
        } else {
          toast.error("Không thể tạo tài khoản mới!");
        }
      }
    } catch (err) {
      console.error("Error in fetchOrCreateUser:", err);
      toast.error("Lỗi khi truy cập dữ liệu người dùng!");
    }
  };

  // ✅ Khi đăng nhập, đồng bộ user trong DB
  useEffect(() => {
    if (isLogged && currentUser?.email) {
      fetchOrCreateUser(currentUser);
    }
  }, [isLogged, currentUser]);

  // ✅ Logout
  const handleLogout = () => {
    sessionStorage.removeItem("data");
    sessionStorage.removeItem("cart");
    setThisUser(null);
    toast.success("Đã đăng xuất thành công!");
    refreshAuth();
    navigate("/login");
  };

  const handleHover = (e, isEnter) => {
    e.target.style.transform = isEnter ? "translateY(-2px)" : "translateY(0)";
    e.target.style.boxShadow = isEnter
      ? "0 4px 12px rgba(0, 123, 255, 0.15)"
      : "0 2px 4px rgba(0, 0, 0, 0.05)";
    e.target.style.borderColor = isEnter ? "#007bff" : "#e9ecef";
  };

  return (
    <div className="d-flex align-items-center gap-2">
      {/* Cart button (always visible) */}
      <Link to="/cart" className="position-relative">
        <button
          type="button"
          className="btn"
          style={btnStyle}
          onMouseEnter={(e) => handleHover(e, true)}
          onMouseLeave={(e) => handleHover(e, false)}
        >
          <img src={cartIcon} alt="cart" width="20" height="20" />
          <span
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
            style={{
              fontSize: "0.7rem",
              background: "linear-gradient(135deg, #DC143C, #B22222)",
              color: "white",
            }}
          >
            {cartCount}
          </span>
        </button>
      </Link>

      {/* User menu: login button or dropdown when logged in */}
      {!isLogged ? (
        <Link
          to="/login"
          className="btn d-flex align-items-center gap-2"
          style={btnStyle}
          onMouseEnter={(e) => handleHover(e, true)}
          onMouseLeave={(e) => handleHover(e, false)}
        >
          <FaUserAlt src={userIcon} alt="user" width="18" height="18" />
          <span className="d-none d-md-inline">Login</span>
        </Link>
      ) : (
        <div className="dropdown">
          <button
            className="btn dropdown-toggle d-flex align-items-center gap-2"
            id="userDropdown"
            data-bs-toggle="dropdown"
            data-bs-display="static"
            aria-expanded="false"
            style={btnStyle}
            onMouseEnter={(e) => handleHover(e, true)}
            onMouseLeave={(e) => handleHover(e, false)}
          >
            {thisUser?.picture ? (
              <img
                src={thisUser?.picture}
                alt="user"
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <FaUserAlt width="18" height="18" />
            )}

            <span
              className="d-none d-md-inline"
              style={{
                maxWidth: "10ch",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {thisUser?.name || "User"}
            </span>
          </button>

          <ul
            className="dropdown-menu dropdown-menu-end"
            aria-labelledby="userDropdown"
          >
            <li>
              <Link
                to={`/profile/${thisUser?.id}`}
                className="dropdown-item d-flex align-items-center gap-2"
              >
                <BiUser /> My Profile
              </Link>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="dropdown-item d-flex align-items-center gap-2 text-danger"
              >
                <BiLogOut /> Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
