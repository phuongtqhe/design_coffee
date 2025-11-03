import { Outlet } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import Blogs from "../pages/Blogs";
import BlogDetail from "../pages/BlogDetail";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import AllProducts from "../pages/AllProducts";
import ForgotPassword from "../pages/ForgotPassword";
import ProductDetail from "../pages/ProductDetail";
import UserProfile from "../pages/UserProfile";

export function publicRoutes() {
  return [
    {
      path: "/",
      element: (
        <Layout>
          <Outlet />
        </Layout>
      ),
      children: [
        { index: true, element: <Home /> },
        { path: "blogs", element: <Blogs /> },
        { path: "blog/:id", element: <BlogDetail /> },
        { path: "contact", element: <Contact /> },
        { path: "products", element: <AllProducts /> },
        { path: "product/:id", element: <ProductDetail /> },
        { path: "/profile/:id", element: <UserProfile /> },
      ],
    },

    // Các trang riêng biệt (không dùng Layout)
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <SignUp /> },
    { path: "/reset-password", element: <ForgotPassword /> },
  ];
}
