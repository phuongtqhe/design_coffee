import { Outlet } from "react-router-dom";
import DefaultAdminLayout from "../admin/layouts/DefaultAdminLayout";
import Home from "../pages/Home";
import FeedbackAdmin from "../pages/FeedbackAdmin";
import CustomersList from "../pages/CustomersList";
import BlogList from "../pages/BlogList";
import { AuthorizationRoute } from "./authorization-route";

export default function adminRoutes() {
  // Admin routes live under /admin and use DefaultAdminLayout
  return {
    path: "/admin",
    element: (
      <AuthorizationRoute roles={["Admin"]}>
        <DefaultAdminLayout>
          <Outlet />
        </DefaultAdminLayout>
      </AuthorizationRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "contacts", element: <AdminContactList /> },
      { path: "feedbacks", element: <FeedbackAdmin /> },
      { path: "customers", element: <CustomersList /> },
      { path: "blogs", element: <BlogList /> },
    ],
  };
}
