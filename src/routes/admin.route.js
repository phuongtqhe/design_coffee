import { Outlet } from "react-router-dom";
import DefaultAdminLayout from "../admin/layouts/DefaultAdminLayout";
import Home from "../pages/Home";
import FeedbackAdmin from "../pages/FeedbackAdmin";
import CustomersList from "../pages/CustomersList";

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
            { path: 'admin/feedbacks', element: <FeedbackAdmin /> },
            { path: 'admin/customers', element: <CustomersList /> },
        ]
    };
}
