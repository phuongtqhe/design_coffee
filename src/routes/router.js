import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { publicRoutes } from "./public.route";

//Code cũ:
// const allRoutes = createBrowserRouter([
//   publicRoutes()
// ]);

const allRoutes = createBrowserRouter(publicRoutes()); //sửa lại để nhận mảng thay vì object

export const AppRouter = ({ children }) => (
  <>
    <RouterProvider router={allRoutes} />
    {children}
  </>
);
