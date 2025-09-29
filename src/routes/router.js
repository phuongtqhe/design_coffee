import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';
import { publicRoutes } from './public.route';

const allRoutes = createBrowserRouter([
  publicRoutes()
]);

export const AppRouter = ({ children }) => (
  <>
    <RouterProvider router={allRoutes} />
    {children}
  </>
);
