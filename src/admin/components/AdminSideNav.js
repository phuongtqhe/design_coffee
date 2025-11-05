import { Card } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineStock } from "react-icons/ai";
import { AiOutlineShopping } from "react-icons/ai";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { AiOutlinePicRight } from "react-icons/ai";
import { BsTelephone } from "react-icons/bs";
import { BiLogoTelegram } from "react-icons/bi";
import { BiUser } from "react-icons/bi";
import { BiPackage } from "react-icons/bi";
import { BiCategory } from "react-icons/bi";
import Nav from 'react-bootstrap/Nav';
import Accordion from 'react-bootstrap/Accordion';

export default function AdminSideNav(props) {
        const location = useLocation();
        // Route mapping for admin pages
        const navLinks = [
            {
                to: "/admin/dashboard",
                icon: <AiOutlineStock size="22" className="me-2" />,
                label: "Dashboard"
            },
            {
                to: "/admin/product",
                icon: <BiPackage size="22" className="me-2" />,
                label: "Products"
            },
            {
                to: "/admin/categories",
                icon: <BiCategory size="22" className="me-2" />,
                label: "Categories"
            },
            {
                to: "/admin/order-list",
                icon: <AiOutlineShopping size="22" className="me-2" />,
                label: "Orders"
            },
            {
                to: "/admin/customers",
                icon: <BiUser size="22" className="me-2" />,
                label: "Customers"
            },
            {
                to: "/admin/contacts",
                icon: <BsTelephone size="22" className="me-2" />,
                label: "Contacts"
            },
            {
                to: "/admin/feedbacks",
                icon: <BiLogoTelegram size="22" className="me-2" />,
                label: "Feedbacks"
            },
            {
                to: "/admin/blogs",
                icon: <AiOutlinePicRight size="22" className="me-2" />,
                label: "Blogs"
            },
        ];

        return (
            <Card className={props.className} style={{position:"sticky", top: 0, minHeight: "100vh", border: "none", background: "#f8f9fa" }}>
                <Card.Body className="p-0">
                    <div className="d-flex flex-column align-items-center py-4">
                        <Link to="/admin/dashboard" className="mb-3">
                            <img src="/logo_main.png" alt="logo" style={{ width: "120px" }} />
                        </Link>
                        <div className="w-100 mb-3" style={{ height: "2px", background: "#dee2e6" }} />
                        <Nav className="flex-column w-100">
                            {navLinks.map((item, idx) => (
                                <Nav.Item key={idx} className="mb-2">
                                    <Nav.Link
                                        as={Link}
                                        to={item.to}
                                        active={location.pathname === item.to || (item.to === "/admin/product" && location.pathname.startsWith("/admin/product"))}
                                        className="d-flex align-items-center px-3 py-2 rounded"
                                        style={{ fontWeight: (location.pathname === item.to || (item.to === "/admin/product" && location.pathname.startsWith("/admin/product"))) ? "bold" : "normal", color: (location.pathname === item.to || (item.to === "/admin/product" && location.pathname.startsWith("/admin/product"))) ? "#0d6efd" : "#333" }}
                                    >
                                        {item.icon}
                                        {item.label}
                                    </Nav.Link>
                                </Nav.Item>
                            ))}
                        </Nav>
                    </div>
                </Card.Body>
            </Card>
        );
}