import React, { useEffect, useState } from "react";
import { Container, Nav, Spinner } from "react-bootstrap";
import ProfileTab from "../components/profile/ProfileTab";
import OrderHistoryTab from "../components/profile/OrderHistoryTab";
import SettingsTab from "../components/profile/SettingsTab";
import { FaUser, FaBoxOpen, FaCog, FaEnvelope } from "react-icons/fa";

function UserProfile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionUser = JSON.parse(sessionStorage.getItem("data"));
    if (!sessionUser?.email) {
      setLoading(false);
      return;
    }

    fetch(
      `http://localhost:9999/users?email=${encodeURIComponent(
        sessionUser.email
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setUserData(data[0]);
        } else {
          // Nếu không có trong DB (trường hợp Google login lần đầu)
          setUserData(sessionUser);
        }
      })
      .catch(() => setUserData(sessionUser))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <Spinner animation="border" variant="secondary" />
      </Container>
    );
  }

  if (!userData) {
    return (
      <Container className="text-center py-5">
        <h4 className="text-muted">No user data found. Please log in again.</h4>
      </Container>
    );
  }

  // ✅ Lấy chữ cái đầu làm avatar nếu không có hình
  const initials = userData.name
    ? userData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <Container fluid className="p-0">
      {/* Banner Header */}
      <div
        className="text-white py-4 px-5"
        style={{
          background: "linear-gradient(90deg, #4b4b4b, #2e2e2e)",
        }}
      >
        <div className="d-flex align-items-center">
          {userData.picture ? (
            <img
              src={userData.picture}
              alt="avatar"
              className="rounded-circle border border-3 border-white me-3"
              style={{
                width: "90px",
                height: "90px",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              className="rounded-circle d-flex justify-content-center align-items-center fw-bold"
              style={{
                width: "90px",
                height: "90px",
                backgroundColor: "#d9d9d9",
                color: "#4b4b4b",
                fontSize: "30px",
                marginRight: "20px",
                border: "4px solid white",
              }}
            >
              {initials}
            </div>
          )}

          <div>
            <h3 className="fw-bold mb-1">{userData.name}</h3>
            <div className="d-flex align-items-center mb-2">
              <FaEnvelope className="me-2" />
              {userData.email}
            </div>
            <div className="d-flex gap-3 text-light small">
              <span>📦 0 Orders</span>
              <span>❤️ Coffee Lover</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Nav
        variant="tabs"
        activeKey={activeTab}
        onSelect={(key) => setActiveTab(key)}
        className="px-5 shadow-sm"
        style={{ backgroundColor: "#f2f2f2" }}
      >
        <Nav.Item>
          <Nav.Link eventKey="profile">
            <FaUser className="me-2" /> Profile
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="orders">
            <FaBoxOpen className="me-2" /> Order History
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="settings">
            <FaCog className="me-2" /> Settings
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {/* Tab Content */}
      <Container className="py-4">
        {activeTab === "profile" && <ProfileTab user={userData} />}
        {activeTab === "orders" && <OrderHistoryTab user={userData} />}
        {activeTab === "settings" && <SettingsTab user={userData} />}
      </Container>
    </Container>
  );
}

export default UserProfile;
