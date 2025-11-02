import { Outlet } from "react-router-dom";
import ErrorPage from "../pages/errorPage";
import { AuthorizationRoute } from "./authorization-route";
// import Cart from '../pages/Cart';
import Layout from "../components/Layout";
import { ProtectedRoute } from "./protected-route";
import UserProfile from "../pages/UserProfile";

export function customerRoutes() {
  return {
    path: "/",
    errorElement: <ErrorPage />,
    element: (
      <ProtectedRoute>
        <AuthorizationRoute roles={["Customer"]}>
          <Layout>
            <Outlet />
          </Layout>
        </AuthorizationRoute>
      </ProtectedRoute>
    ),
    children: [
      // { path: '/cart', element: <Cart /> },
      // { path: "/profile/:id", element: <UserProfile /> },
    ],
  };
}
