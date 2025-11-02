import React, { useState } from "react";
import { useCart } from "../components/CartContext";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Form, Modal } from "react-bootstrap";
import { FaTrash, FaEdit } from "react-icons/fa";

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, updateToppings, total } = useCart();
  const navigate = useNavigate();
  const [showToppingsModal, setShowToppingsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [tempToppings, setTempToppings] = useState([]);

  const availableToppings = [
    "Trân châu đen",
    "Trân châu trắng", 
    "Thạch trái cây",
    "Pudding",
    "Kem cheese",
    "Whipped cream"
  ];

  const handleEditToppings = (item) => {
    setSelectedItem(item);
    setTempToppings(item.toppings || []);
    setShowToppingsModal(true);
  };

  const handleSaveToppings = () => {
    if (selectedItem) {
      updateToppings(selectedItem.id, tempToppings);
      setShowToppingsModal(false);
      setSelectedItem(null);
      setTempToppings([]);
    }
  };

  const handleToppingChange = (topping) => {
    setTempToppings(prev => 
      prev.includes(topping)
        ? prev.filter(t => t !== topping)
        : [...prev, topping]
    );
  };

  if (cartItems.length === 0) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <h3 className="mb-4">Giỏ hàng của bạn đang trống 😢</h3>
            <Button variant="primary" onClick={() => navigate("/products")}>
              Tiếp tục mua sắm
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col lg={8}>
          <Card>
            <Card.Header>
              <h4 className="mb-0">Chi tiết giỏ hàng ({cartItems.length} sản phẩm)</h4>
            </Card.Header>
            <Card.Body className="p-0">
              {cartItems.map((item, index) => (
                <div key={item.id} className={`p-4 ${index !== cartItems.length - 1 ? 'border-bottom' : ''}`}>
                  <Row className="align-items-center">
                    {/* Product Image */}
                    <Col md={2}>
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="img-fluid rounded"
                        style={{ width: "80px", height: "80px", objectFit: "cover" }}
                      />
                    </Col>
                    
                    {/* Product Details */}
                    <Col md={5}>
                      <h6 className="mb-2">{item.name}</h6>
                      <div className="small text-muted">
                        <div>Độ đá: {item.iceLevel}</div>
                        <div>Độ ngọt: {item.sugarLevel}</div>
                        <div className="d-flex align-items-center">
                          <span>Topping: {item.toppings?.length > 0 ? item.toppings.join(", ") : "Không có"}</span>
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="p-1 ms-2"
                            onClick={() => handleEditToppings(item)}
                          >
                            <FaEdit size={12} />
                          </Button>
                        </div>
                      </div>
                    </Col>
                    
                    {/* Quantity */}
                    <Col md={2}>
                      <Form.Control
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        min="1"
                        size="sm"
                      />
                    </Col>
                    
                    {/* Price */}
                    <Col md={2} className="text-center">
                      <div className="small text-muted">${item.price.toFixed(2)} × {item.quantity}</div>
                      <div className="fw-bold text-primary">${item.totalPrice.toFixed(2)}</div>
                    </Col>
                    
                    {/* Delete Button */}
                    <Col md={1} className="text-center">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <FaTrash />
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        {/* Order Summary */}
        <Col lg={4}>
          <Card className="sticky-top" style={{ top: "20px" }}>
            <Card.Header>
              <h5 className="mb-0">Tổng đơn hàng</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-3">
                <span>Tạm tính:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Phí vận chuyển:</span>
                <span className="text-success">Miễn phí</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <strong>Tổng cộng:</strong>
                <strong className="text-primary">${total.toFixed(2)}</strong>
              </div>
              <Button
                variant="success"
                size="lg"
                className="w-100"
                onClick={() => navigate("/checkout")}
              >
                Tiến hành thanh toán
              </Button>
              <Button
                variant="outline-secondary"
                className="w-100 mt-2"
                onClick={() => navigate("/products")}
              >
                Tiếp tục mua sắm
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Toppings Edit Modal */}
      <Modal show={showToppingsModal} onHide={() => setShowToppingsModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa topping</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <strong>Sản phẩm: </strong>{selectedItem?.name}
          </div>
          <div>
            <strong>Chọn topping:</strong>
            {availableToppings.map((topping) => (
              <Form.Check
                key={topping}
                type="checkbox"
                label={topping}
                checked={tempToppings.includes(topping)}
                onChange={() => handleToppingChange(topping)}
                className="mt-2"
              />
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowToppingsModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSaveToppings}>
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
