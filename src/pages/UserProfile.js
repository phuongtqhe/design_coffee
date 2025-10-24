import React, { useState } from "react";
import { Container, Nav } from "react-bootstrap";
import ProfileTab from "../components/profile/ProfileTab";
import OrderHistoryTab from "../components/profile/OrderHistoryTab";
import SettingsTab from "../components/profile/SettingsTab";
import { FaUser, FaBoxOpen, FaCog, FaEnvelope, FaHeart } from "react-icons/fa";

function UserProfile() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <Container fluid className="p-0">
      {/* Header */}
      <div
        className="text-white py-4 px-5"
        style={{
          background: "linear-gradient(90deg, #4b4b4b, #2e2e2e)",
        }}
      >
        <div className="d-flex align-items-center">
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
            JD
          </div>
          <div>
            <h3 className="fw-bold mb-1">John Doe</h3>
            <div className="d-flex align-items-center mb-2">
              <FaEnvelope className="me-2" />
              john.doe@email.com
            </div>
            <div className="d-flex gap-3">
              <span>📦 24 Orders</span>
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
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "orders" && <OrderHistoryTab />}
        {activeTab === "settings" && <SettingsTab />}
      </Container>
    </Container>
  );
}

export default UserProfile;
