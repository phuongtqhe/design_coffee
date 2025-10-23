import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { FaEnvelope, FaUser, FaPhone } from "react-icons/fa";

function ProfileTab() {
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
            <h6>John Doe</h6>
          </Col>
          <Col md={6}>
            <p className="text-muted mb-1">Username</p>
            <h6>@johndoe</h6>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col md={6}>
            <p className="text-muted mb-1">Email</p>
            <h6>
              <FaEnvelope className="me-2 text-secondary" />
              john.doe@email.com
            </h6>
          </Col>
          <Col md={6}>
            <p className="text-muted mb-1">Phone</p>
            <h6>
              <FaPhone className="me-2 text-secondary" />
              +84 123 456 789
            </h6>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default ProfileTab;
