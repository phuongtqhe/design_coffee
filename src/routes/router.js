import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { publicRoutes } from "./public.route";
import adminRoutes from "./admin.route";
import { customerRoutes } from "./customer.route";

// Compose routes: spread public (array) and include customer/admin route objects
const routeArray = [
  ...publicRoutes(),
  customerRoutes(),
  adminRoutes(),
];

const allRoutes = createBrowserRouter(routeArray);

export const AppRouter = ({ children }) => (
  <>
    <RouterProvider router={allRoutes} />
    {children}
  </>
);
