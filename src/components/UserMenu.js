import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthentication } from "../utils/use-authentication";
import { CartContext } from "./CartContext";
import userIcon from "../images/user.svg";
import wishlistIcon from "../images/wishlist.svg";
import compareIcon from "../images/compare.svg";
import cartIcon from "../images/cart.svg";
import { BiLogOut, BiUser } from "react-icons/bi";
import { FaMoneyCheckDollar } from "react-icons/fa6";

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
  const { isLogged, currentUser } = useAuthentication();
  const { cartQuantity } = useContext(CartContext);
  const [thisUser, setThisUser] = useState(null);

  useEffect(() => {
    if (isLogged) {
      const userData = JSON.parse(sessionStorage.getItem("data"));
      if (!userData?.email) return;

      // ✅ Fetch user bằng email qua query string
      fetch(
        `http://localhost:9999/users?email=${encodeURIComponent(
          userData.email
        )}`
      )
        .then((res) => res.json())
        .then(async (users) => {
          if (users.length > 0) {
            // Nếu user đã tồn tại trong DB
            setThisUser(users[0]);
          } else {
            // Nếu là user Google login lần đầu → tạo mới
            const newUser = {
              id: userData.email,
              email: userData.email,
              name: userData.name || "Guest User",
              picture: userData.picture || "",
              role: "customer",
            };

            await fetch("http://localhost:9999/users", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(newUser),
            });

            setThisUser(newUser);
            toast.info("Tài khoản Google mới đã được tạo tự động!");
          }
        })
        .catch(() => {
          setThisUser({
            name: userData.name || "Guest User",
            email: userData.email,
            picture: userData.picture || null,
          });
        });
    }
  }, [isLogged]);

  const handleLogout = () => {
    sessionStorage.removeItem("data");
    sessionStorage.removeItem("cart");
    toast.success("Đã đăng xuất thành công!");
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
      {isLogged && (
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
              {cartQuantity}
            </span>
          </button>
        </Link>
      )}

      {!isLogged ? (
        <Link
          to="/login"
          className="btn d-flex align-items-center gap-2"
          style={btnStyle}
          onMouseEnter={(e) => handleHover(e, true)}
          onMouseLeave={(e) => handleHover(e, false)}
        >
          <img src={userIcon} alt="user" width="18" height="18" />
          <span className="d-none d-md-inline">Login</span>
        </Link>
      ) : (
        <div className="dropdown">
          <button
            className="btn dropdown-toggle d-flex align-items-center gap-2"
            id="userDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={btnStyle}
            onMouseEnter={(e) => handleHover(e, true)}
            onMouseLeave={(e) => handleHover(e, false)}
          >
            <img
              src={thisUser?.picture || userIcon}
              alt="user"
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <span
              className="d-none d-md-inline"
              style={{
                maxWidth: "10ch",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {thisUser?.name}
            </span>
          </button>

          <ul
            className="dropdown-menu dropdown-menu-end"
            aria-labelledby="userDropdown"
          >
            <li>
              <Link
                to={`/profile/${thisUser?.email}`}
                className="dropdown-item d-flex align-items-center gap-2"
              >
                <BiUser /> My Profile
              </Link>
            </li>
            {/* <li>
              <Link
                to="/myOrder"
                className="dropdown-item d-flex align-items-center gap-2"
              >
                <FaMoneyCheckDollar /> My Orders
              </Link>
            </li> */}
            <li>
              <Link
                to="/wishlist"
                className="dropdown-item d-flex align-items-center gap-2"
              >
                <img src={wishlistIcon} width="16" height="16" alt="wishlist" />
                Wishlist
              </Link>
            </li>
            <li>
              <Link
                to="/compare-product"
                className="dropdown-item d-flex align-items-center gap-2"
              >
                <img src={compareIcon} width="16" height="16" alt="compare" />
                Compare Products
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
