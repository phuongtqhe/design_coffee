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
import AddProduct from "../pages/Addproduct";
import AdminProductlist from "../pages/AdminProductlist";
import AdminProductDetail from "../pages/AdminProductDetail";
import AdminEditProduct from "../pages/AdminEditProduct";
import AdminCategory from "../pages/AdminCategory";

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
      { path: "dashboard", element: <Dashboard /> },
      { path: "product", element: <AdminProductlist /> },
      { path: "product/add-product", element: <AddProduct /> },
      { path: "categories", element: <AdminCategory /> },
      { path: "contacts", element: <AdminContactList /> },
      { path: "feedbacks", element: <FeedbackAdmin /> },
      { path: "customers", element: <CustomersList /> },
      { path: "blogs", element: <BlogList /> },
      { path: "order-list", element: <AdminOrderList /> },
      { path: '/admin/product/:id', element: <AdminProductDetail /> },
      { path: '/admin/product/edit/:id', element: <AdminEditProduct /> },
    ],
  };
}
