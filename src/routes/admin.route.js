import { Outlet } from "react-router-dom";
import DefaultAdminLayout from "../admin/layouts/DefaultAdminLayout";
import Home from "../pages/Home";
import FeedbackAdmin from "../pages/FeedbackAdmin";

export default function adminRoutes() {
    return {
        path: '/',
        element: (
            <DefaultAdminLayout>
                <Outlet />
            </DefaultAdminLayout>
        ),
        children: [
            { index: true, element: <Home /> },
            { path: 'feedbacks', element: <FeedbackAdmin /> },
            // { path: '/admin/dashboard', element: <Dashboard /> },
        ]
    };
}
