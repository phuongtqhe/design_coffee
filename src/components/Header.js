import React, { useState, useEffect, useContext } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import { useAuthentication } from "../utils/use-authentication";
import { CartContext } from "./CartContext";
import UserMenu from "./UserMenu";

const Header = () => {
  const navigate = useNavigate();
  const { isLogged, currentUser } = useAuthentication();
  const { cartQuantity } = useContext(CartContext);
  const [thisUser, setThisUser] = useState(null);
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    if (isLogged && currentUser?.id) {
      fetch(`http://localhost:9999/users/${encodeURIComponent(currentUser.id)}`)
        .then((res) => {
          if (!res.ok) throw new Error("Không tìm thấy người dùng");
          return res.json();
        })
        .then((data) => setThisUser(data))
        .catch((err) => console.error("Error fetching user:", err));
    }
  }, [isLogged, currentUser]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(searchKey ? `/product?search=${searchKey}` : "/product");
  };

  return (
    <>
      {/* 🔹 Top Header */}
      <header className="header-upper py-4" style={{ zIndex: 1050 }}>
        <div className="container-xxl">
          <div className="row align-items-center">
            {/* Brand + Nav */}
            <div className="col-12 col-lg-8">
              <div className="d-flex align-items-center flex-wrap gap-4">
                {/* Logo */}
                <Link to="/" className="text-decoration-none">
                  <img
                    src="/logo_main.png"
                    alt="logo"
                    style={{ height: "60px", width: "auto" }}
                  />
                </Link>

                {/* Navigation */}
                <nav className="d-flex align-items-center flex-wrap">
                  {["/", "/products", "/about", "/blogs", "/contact"].map(
                    (path, i) => {
                      const labels = [
                        "HOME",
                        "PRODUCTS",
                        "ABOUT US",
                        "BLOGS",
                        "CONTACT US",
                      ];
                      return (
                        <NavLink
                          key={path}
                          to={path}
                          className="nav-link me-4 px-3 py-2 rounded fw-medium text-decoration-none"
                          activeclassname="active"
                        >
                          {labels[i]}
                        </NavLink>
                      );
                    }
                  )}
                </nav>
              </div>
            </div>

            {/* Search + UserMenu */}
            <div className="col-12 col-lg-4 mt-3 mt-lg-0">
              <div className="d-flex align-items-center justify-content-end gap-3">
                {/* Search */}
                <form
                  className="input-group"
                  style={{ maxWidth: "300px" }}
                  onSubmit={handleSearch}
                >
                  <input
                    type="text"
                    className="form-control border-0"
                    style={{ height: "45px" }}
                    placeholder="Search Coffee, Beans..."
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
                  />
                  <button
                    className="btn"
                    type="submit"
                    style={{ height: "45px" }}
                  >
                    <BsSearch className="fs-6" />
                  </button>
                </form>

                {/* User Menu */}
                <UserMenu />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 🔹 Contact & Offers */}
      <header
        className="header-bottom py-2"
        style={{ position: "relative", zIndex: 1000 }}
      >
        <div className="container-xxl">
          <div className="row align-items-center">
            {/* Left: Contact */}
            <div className="col-12 col-md-6 text-center text-md-start">
              <div className="d-flex align-items-center gap-2 justify-content-center justify-content-md-start">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.095 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.59531 1.99522 8.06613 2.16708 8.43376 2.48353C8.80139 2.79999 9.04207 3.23945 9.10999 3.72C9.23662 4.68007 9.47144 5.62273 9.80999 6.53C9.94454 6.88792 9.97366 7.27691 9.89391 7.65088C9.81415 8.02485 9.62886 8.36811 9.35999 8.64L8.08999 9.91C9.51355 12.4135 11.5865 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9751 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 21.99 16.92H22Z"
                    stroke="#007bff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-dark fw-medium">
                  Call us: +1 (555) 123-4567
                </span>
              </div>
            </div>

            {/* Right: Offers */}
            <div className="col-12 col-md-6 text-center text-md-end mt-2 mt-md-0">
              <div className="d-flex align-items-center justify-content-center justify-content-md-end gap-4 flex-wrap">
                <span className="text-success fw-medium">
                  🌿 Free Shipping on Orders Over $50
                </span>
                <span className="text-warning fw-medium">
                  🎉 20% Off First Order
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
