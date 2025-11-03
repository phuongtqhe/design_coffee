import { Outlet } from "react-router-dom";
import { AuthorizationRoute } from "./authorization-route";
import Layout from "../components/Layout";
import UserProfile from "../pages/UserProfile";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Feedback from "../pages/Feedback";

export function customerRoutes() {
  // Customer-specific routes: protected by authentication and role
  return {
    path: "/",
    // errorElement: <ErrorPage />,
    element: (
     <AuthorizationRoute roles={["Customer"]}>
        <Layout>
          <Outlet />
        </Layout>
     </AuthorizationRoute>
    ),
    children: [
      { path: "cart", element: <Cart /> },
      { path: "checkout", element: <Checkout /> },
      { path: "feedback", element: <Feedback /> },
      { path: "profile/:id", element: <UserProfile /> },
    ],
  };
}
