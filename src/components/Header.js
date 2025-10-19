import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import { createContext, useContext, useState, useEffect } from "react";
import menu from "../images/menu.svg";
import { useAuthentication } from "../utils/use-authentication";
import { CartContext } from './CartContext'
import UserMenu from "./UserMenu";

const Header = () => {
  const { isLogged } = useAuthentication();
  const navigate = useNavigate();
  const [thisUser, setThisUser] = useState();
  const { currentUser } = useAuthentication();
  const [searchKey, setSearchKey] = useState();
  const { cartQuantity, setCartQuantity } = useContext(CartContext)

  useEffect(() => {
    if (isLogged) {
      fetch("http://localhost:9999/users/" + JSON.parse(sessionStorage.getItem("data")).email)
        .then(res => res.json())
        .then(json => setThisUser(json))
    }
  }, [isLogged]
  )

  

  return (
    <>
      <header className="header-upper py-4">
        <div className="container-xxl">
          <div className="row align-items-center">
            {/* Left Part - Brand and Navigation */}
            <div className="col-12 col-lg-8">
              <div className="d-flex align-items-center flex-wrap">
                {/* Brand Logo */}
                <div className="mb-4 mb-4 mb-lg-0">
                  <Link to="/" className="text-decoration-none">
                    <img 
                      style={{ height: "60px", width: "auto" }} 
                      src={'/logo_main.png'} 
                      alt='logo'
                    />
                  </Link>
                </div>
                
                {/* Navigation Links */}
                <nav className="d-flex align-items-center flex-wrap">
                  <NavLink 
                    to="/" 
                    className="nav-link me-4 px-3 py-2 rounded text-decoration-none fw-medium"
                    activeClassName="active"
                  >
                    HOME
                  </NavLink>
                  <NavLink 
                    to="/products" 
                    className="nav-link me-4 px-3 py-2 rounded text-decoration-none fw-medium"
                    activeClassName="active"
                  >
                    PRODUCTS
                  </NavLink>
                  <NavLink 
                    to="/about" 
                    className="nav-link me-4 px-3 py-2 rounded text-decoration-none fw-medium"
                    activeClassName="active"
                  >
                    ABOUT US
                  </NavLink>
                  <NavLink 
                    to="/blogs" 
                    className="nav-link me-4 px-3 py-2 rounded text-decoration-none fw-medium"
                    activeClassName="active"
                  >
                    BLOGS
                  </NavLink>
                  <NavLink 
                    to="/contact" 
                    className="nav-link px-3 py-2 rounded text-decoration-none fw-medium"
                    activeClassName="active"
                  >
                    CONTACT US
                  </NavLink>
                </nav>
              </div>
            </div>

            {/* Right Part - Search and User Actions */}
            <div className="col-12 col-lg-4">
              <div className="d-flex align-items-center justify-content-end gap-3">
                {/* Search Bar */}
                <div className="search-container flex-grow-1" style={{ maxWidth: "300px" }}>
                  <form action={"/product/" + searchKey} onSubmit={(e) => {
                    e.preventDefault();
                    navigate(searchKey ? `/product?search=${searchKey}` : '/product');
                  }}>
                    <div className="input-group">
                      <input
                        style={{ height: "45px" }}
                        onChange={(e) => setSearchKey(e.target.value)}
                        type="text"
                        className="form-control border-0"
                        placeholder="Search Coffee, Beans..."
                        aria-label="Search Coffee, Beans..."
                        aria-describedby="search-addon"
                      />
                      <button 
                        className="btn" 
                        type="submit"
                        id="search-addon"
                        style={{ height: "45px" }}
                      >
                        <BsSearch className="fs-6" />
                      </button>
                    </div>
                  </form>
                </div>

                {/* User Actions */}
                <UserMenu />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contact & Offers Section */}
      <header className="header-bottom py-2">
        <div className="container-xxl">
          <div className="row align-items-center">
            <div className="col-12 col-md-6">
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.095 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.59531 1.99522 8.06613 2.16708 8.43376 2.48353C8.80139 2.79999 9.04207 3.23945 9.10999 3.72C9.23662 4.68007 9.47144 5.62273 9.80999 6.53C9.94454 6.88792 9.97366 7.27691 9.89391 7.65088C9.81415 8.02485 9.62886 8.36811 9.35999 8.64L8.08999 9.91C9.51355 12.4135 11.5865 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9751 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 21.99 16.92H22Z" stroke="#007bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-dark fw-medium">Call us: +1 (555) 123-4567</span>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="d-flex align-items-center justify-content-md-end gap-3 mt-2 mt-md-0">
                <div className="d-flex align-items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="#28a745"/>
                  </svg>
                  <span className="text-success fw-medium">Free Shipping on Orders Over $50</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 6.5V8.5L21 9ZM7.5 8.5V6.5L3 7V9L7.5 8.5ZM12 7.5C13.38 7.5 14.5 8.62 14.5 10C14.5 11.38 13.38 12.5 12 12.5C10.62 12.5 9.5 11.38 9.5 10C9.5 8.62 10.62 7.5 12 7.5ZM21 15V13L15 12.5V14.5L21 15ZM7.5 14.5V12.5L3 13V15L7.5 14.5ZM12 14C13.38 14 14.5 15.12 14.5 16.5C14.5 17.88 13.38 19 12 19C10.62 19 9.5 17.88 9.5 16.5C9.5 15.12 10.62 14 12 14Z" fill="#ffc107"/>
                  </svg>
                  <span className="text-warning fw-medium">20% Off First Order</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;