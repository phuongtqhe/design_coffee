import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import {
  FaEnvelope,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from "react-icons/fa";

function ProfileTab({ user }) {
  if (!user) return null;

  const { userName, email, phone, role, status, address, createdAt } = user;

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body>
        <h5 className="fw-bold mb-4">
          <FaUser className="me-2 text-secondary" />
          Personal Information
        </h5>

        <Row>
          <Col md={6}>
            <p className="text-muted mb-1">Full Name</p>
            <h6>{userName || "Not provided"}</h6>
          </Col>
          <Col md={6}>
            <p className="text-muted mb-1">Role</p>
            <h6 className="text-capitalize">{role || "customer"}</h6>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col md={6}>
            <p className="text-muted mb-1">Email</p>
            <h6>
              <FaEnvelope className="me-2 text-secondary" />
              {email || "Not provided"}
            </h6>
          </Col>
          <Col md={6}>
            <p className="text-muted mb-1">Phone</p>
            <h6>
              <FaPhone className="me-2 text-secondary" />
              {phone || "Not provided"}
            </h6>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col md={12}>
            <p className="text-muted mb-1">Address</p>
            <h6>
              <FaMapMarkerAlt className="me-2 text-secondary" />
              {address?.detailAddress ||
              address?.street ||
              address?.city ||
              address?.country
                ? `${
                    address.detailAddress ? address.detailAddress + ", " : ""
                  }${address.street ? address.street + ", " : ""}${
                    address.city ? address.city + ", " : ""
                  }${address.country || ""}`
                : "Not provided"}
            </h6>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col md={6}>
            <p className="text-muted mb-1">Account Status</p>
            <h6
              className={`fw-semibold ${
                status === "active" ? "text-success" : "text-danger"
              }`}
            >
              {status || "unknown"}
            </h6>
          </Col>
          <Col md={6}>
            <p className="text-muted mb-1">Member Since</p>
            <h6>
              <FaCalendarAlt className="me-2 text-secondary" />
              {createdAt ? new Date(createdAt).toLocaleDateString() : "Unknown"}
            </h6>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default ProfileTab;
