import { Outlet } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';

export function publicRoutes() {
    return {
        path: '/',
        element: (
          <Layout>
              <Outlet />
          </Layout>
        ),
        children: [
            { index: true, element: <Home /> },
        ],
    };
}
