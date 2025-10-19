import { Outlet } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import Blogs from "../pages/Blogs";
import BlogDetail from "../pages/BlogDetail";
import Contact from "../pages/Contact";
// import Login_2 from "../pages/Login_2";
// import SignUp_2 from "../pages/SignUp_2";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Feedback from "../pages/Feedback";

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
      ],
    },

    //Những trang riêng không dùng chung container
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <SignUp /> },
  ];
}
