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

const UserMenu = () => {
  const navigate = useNavigate();
  const { isLogged, currentUser } = useAuthentication();
  const [thisUser, setThisUser] = useState();
  const { cartQuantity } = useContext(CartContext);

  useEffect(() => {
    if (isLogged) {
      fetch(
        "http://localhost:9999/users/" +
          JSON.parse(sessionStorage.getItem("data")).email
      )
        .then((res) => res.json())
        .then((json) => setThisUser(json));
    }
  }, [isLogged]);

  const handleLogout = () => {
    sessionStorage.removeItem("data");
    sessionStorage.removeItem("cart");
    toast.success("Successfully logged out!");
    navigate("/login");
  };

  return (
    <div className="d-flex align-items-center gap-2">
      {isLogged && (
        <Link to="/cart" className="position-relative">
          <button type="button" className="btn btn-outline-primary">
            <img src={cartIcon} alt="cart" style={{ width: "20px", height: "20px" }} />
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              style={{ fontSize: "0.7rem" }}
            >
              {cartQuantity}
              <span className="visually-hidden">items in cart</span>
            </span>
          </button>
        </Link>
      )}

      {!isLogged ? (
        <Link to="/login" className="btn btn-outline-primary d-flex align-items-center gap-2">
          <img src={userIcon} alt="user" style={{ width: "18px", height: "18px" }} />
          <span className="d-none d-md-inline">Login</span>
        </Link>
      ) : (
        <div className="dropdown">
          <button
            className="btn btn-outline-primary dropdown-toggle d-flex align-items-center gap-2"
            type="button"
            id="userDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img src={userIcon} alt="user" style={{ width: "18px", height: "18px" }} />
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
          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
            <li>
              <Link
                to={`/profile/${currentUser.email}`}
                className="dropdown-item d-flex align-items-center gap-2"
              >
                <BiUser /> My Profile
              </Link>
            </li>
            <li>
              <Link to="/myOrder" className="dropdown-item d-flex align-items-center gap-2">
                <FaMoneyCheckDollar /> My Orders
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className="dropdown-item d-flex align-items-center gap-2">
                <img src={wishlistIcon} alt="wishlist" style={{ width: "16px", height: "16px" }} />
                Wishlist
              </Link>
            </li>
            <li>
              <Link
                to="/compare-product"
                className="dropdown-item d-flex align-items-center gap-2"
              >
                <img src={compareIcon} alt="compare" style={{ width: "16px", height: "16px" }} />
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



