import React from "react";
import { Card, Form, Button } from "react-bootstrap";
import { FaLock } from "react-icons/fa";

function SettingsTab() {
  return (
    <>
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <h5 className="fw-bold mb-4">
            <FaLock className="me-2 text-secondary" />
            Change Password
          </h5>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control type="password" placeholder="********" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control type="password" placeholder="********" />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control type="password" placeholder="********" />
            </Form.Group>
            <Button variant="secondary" className="w-100">
              Update Password
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <Card
        className="border-0 shadow-sm"
        style={{ backgroundColor: "#f8d7da", border: "1px solid #f5c2c7" }}
      >
        <Card.Body>
          <h6 className="fw-bold text-danger">Danger Zone</h6>
          <p className="text-muted">
            Once you delete your account, there is no going back.
          </p>
          <Button variant="danger" className="w-100">
            Delete Account
          </Button>
        </Card.Body>
      </Card>
    </>
  );
}

export default SettingsTab;
