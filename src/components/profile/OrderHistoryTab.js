import React from "react";
import { Card, Button } from "react-bootstrap";
import { FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";

function OrderHistoryTab() {
  return (
    <Card className="border-0 shadow-sm">
      <Card.Body>
        <h6 className="fw-bold">Order #1000</h6>
        <p className="text-muted mb-1">Oct 20, 2025 • 10:30 AM</p>

        <div className="d-flex align-items-center mt-3 mb-2">
          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#bfbfbf",
              borderRadius: "10px",
              marginRight: "15px",
            }}
          ></div>
          <div>
            <h6 className="fw-bold mb-1">Cappuccino</h6>
            <p className="text-muted mb-0">
              Size: Medium • Ice: 50% • Sugar: 30%
            </p>
            <small className="text-secondary">x2</small>
          </div>
          <div className="ms-auto fw-bold">$8.50</div>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3 border-top pt-2">
          <div className="text-muted">
            <FaMapMarkerAlt className="me-2" />
            123 Coffee Street, Hanoi
          </div>
          <div className="text-success fw-semibold">
            <FaCheckCircle className="me-1" /> Delivered
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <h6>Total: $15.50</h6>
          <div>
            <Button variant="secondary" className="me-2">
              View Details
            </Button>
            <Button variant="outline-secondary">Reorder</Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default OrderHistoryTab;
