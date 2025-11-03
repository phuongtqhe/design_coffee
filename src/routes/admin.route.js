import { Outlet } from "react-router-dom";
import DefaultAdminLayout from "../admin/layouts/DefaultAdminLayout";
import Home from "../pages/Home";
import FeedbackAdmin from "../pages/FeedbackAdmin";
import CustomersList from "../pages/CustomersList";
import BlogList from "../pages/BlogList";
import AdminContactList from "../pages/AdminContactList";
import { AuthorizationRoute } from "./authorization-route";
import AdminOrderList from "../pages/AdminOrderList";
import Dashboard from "../pages/AdminDashboard";

export default function adminRoutes() {
  // Admin routes live under /admin and use DefaultAdminLayout
  return {
    path: "/admin",
    element: (
      <AuthorizationRoute roles={["admin"]}>
        <DefaultAdminLayout>
          <Outlet />
        </DefaultAdminLayout>
      </AuthorizationRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "contacts", element: <AdminContactList /> },
      { path: "feedbacks", element: <FeedbackAdmin /> },
      { path: "customers", element: <CustomersList /> },
      { path: "blogs", element: <BlogList /> },
      { path: "order-list", element: <AdminOrderList /> },
      { path: "dashboard", element: <Dashboard /> },
    ],
  };
}
