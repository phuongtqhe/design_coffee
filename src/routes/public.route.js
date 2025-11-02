import { Outlet } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import Blogs from "../pages/Blogs";
import BlogDetail from "../pages/BlogDetail";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Feedback from "../pages/Feedback";
import FeedbackAdmin from "../pages/FeedbackAdmin";
import CustomersList from "../pages/CustomersList";
import AdminContactList from "../pages/AdminContactList";
import AllProducts from "../pages/AllProducts";
import ProductDetail from "../pages/ProductDetail";
import UserProfile from "../pages/UserProfile";
import ForgotPassword from "../pages/ForgotPassword";

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
        { path: "feedback", element: <Feedback /> },
        { path: "products", element: <AllProducts /> },
        { path: "product/:id", element: <ProductDetail /> },
        { path: "/profile/:id", element: <UserProfile /> },
      ],
    },

    // 🔹 Các trang riêng biệt (không dùng Layout)
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <SignUp /> },

    // 🔹 Thêm route admin (vì bạn không muốn đổi router.js)
    { path: "/admin/feedbacks", element: <FeedbackAdmin /> },
    { path: "/admin/customers", element: <CustomersList /> },
    { path: "/admin/contacts", element: <AdminContactList /> },
    { path: "/reset-password", element: <ForgotPassword /> },
  ];
}
