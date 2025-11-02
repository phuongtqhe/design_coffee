import React, { useState } from "react";
import { Modal, Button, Form, Row, Col, Card } from "react-bootstrap";
import { useCart } from "./CartContext";
import { toast } from "react-toastify";

const AddToCartModal = ({ show, onHide, product }) => {
  const { addToCart } = useCart();
  const [options, setOptions] = useState({
    iceLevel: "Bình thường",
    sugarLevel: "100%",
    toppings: [],
    quantity: 1
  });

  const iceLevels = ["Không đá", "Ít đá", "Bình thường", "Nhiều đá"];
  const sugarLevels = ["0%", "30%", "50%", "70%", "100%"];
  const availableToppings = [
    { name: "Trân châu đen", price: 0.5 },
    { name: "Trân châu trắng", price: 0.5 },
    { name: "Thạch trái cây", price: 0.7 },
    { name: "Pudding", price: 0.8 },
    { name: "Kem cheese", price: 1.0 },
    { name: "Whipped cream", price: 0.6 }
  ];

  const handleToppingChange = (topping) => {
    setOptions(prev => ({
      ...prev,
      toppings: prev.toppings.includes(topping.name)
        ? prev.toppings.filter(t => t !== topping.name)
        : [...prev.toppings, topping.name]
    }));
  };

  const calculateToppingPrice = () => {
    return options.toppings.reduce((total, toppingName) => {
      const topping = availableToppings.find(t => t.name === toppingName);
      return total + (topping ? topping.price : 0);
    }, 0);
  };

  const calculateTotalPrice = () => {
    if (!product) return 0;
    const basePrice = product.price;
    const toppingPrice = calculateToppingPrice();
    return (basePrice + toppingPrice) * options.quantity;
  };

  const handleAddToCart = () => {
    if (!product) return;

    addToCart(product, options);
    toast.success(`Đã thêm ${product.title || product.name} vào giỏ hàng!`);
    
    // Reset form
    setOptions({
      iceLevel: "Bình thường",
      sugarLevel: "100%",
      toppings: [],
      quantity: 1
    });
    
    onHide();
  };

  const handleClose = () => {
    // Reset form when closing
    setOptions({
      iceLevel: "Bình thường",
      sugarLevel: "100%",
      toppings: [],
      quantity: 1
    });
    onHide();
  };

  if (!product) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Thêm vào giỏ hàng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          {/* Product Info */}
          <Col md={5}>
            <Card className="border-0">
              <Card.Img 
                variant="top" 
                src={(product.images && product.images[0]) || "/logo192.png"} 
                style={{ height: "200px", objectFit: "cover" }}
              />
              <Card.Body className="p-3">
                <Card.Title className="h6">{product.title || product.name}</Card.Title>
                <Card.Text className="small text-muted">
                  {product.description || product.describe}
                </Card.Text>
                <div className="fw-bold text-primary">
                  Giá gốc: ${product.price?.toFixed(2)}
                </div>
                {calculateToppingPrice() > 0 && (
                  <div className="small text-muted">
                    Phụ phí topping: +${calculateToppingPrice().toFixed(2)}
                  </div>
                )}
                <div className="fw-bold text-success mt-2">
                  Tổng: ${calculateTotalPrice().toFixed(2)}
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Options */}
          <Col md={7}>
            <Form>
              {/* Ice Level */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Độ đá</Form.Label>
                <div>
                  {iceLevels.map((level) => (
                    <Form.Check
                      key={level}
                      type="radio"
                      name="iceLevel"
                      label={level}
                      checked={options.iceLevel === level}
                      onChange={() => setOptions(prev => ({ ...prev, iceLevel: level }))}
                      inline
                      className="me-3"
                    />
                  ))}
                </div>
              </Form.Group>

              {/* Sugar Level */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Độ ngọt</Form.Label>
                <div>
                  {sugarLevels.map((level) => (
                    <Form.Check
                      key={level}
                      type="radio"
                      name="sugarLevel"
                      label={level}
                      checked={options.sugarLevel === level}
                      onChange={() => setOptions(prev => ({ ...prev, sugarLevel: level }))}
                      inline
                      className="me-3"
                    />
                  ))}
                </div>
              </Form.Group>

              {/* Toppings */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Topping (tùy chọn)</Form.Label>
                <div>
                  {availableToppings.map((topping) => (
                    <Form.Check
                      key={topping.name}
                      type="checkbox"
                      label={`${topping.name} (+$${topping.price.toFixed(2)})`}
                      checked={options.toppings.includes(topping.name)}
                      onChange={() => handleToppingChange(topping)}
                      className="mb-1"
                    />
                  ))}
                </div>
              </Form.Group>

              {/* Quantity */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Số lượng</Form.Label>
                <Row>
                  <Col xs={6}>
                    <div className="d-flex align-items-center">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => setOptions(prev => ({ 
                          ...prev, 
                          quantity: Math.max(1, prev.quantity - 1) 
                        }))}
                      >
                        -
                      </Button>
                      <Form.Control
                        type="number"
                        value={options.quantity}
                        onChange={(e) => setOptions(prev => ({ 
                          ...prev, 
                          quantity: Math.max(1, parseInt(e.target.value) || 1) 
                        }))}
                        min="1"
                        className="mx-2 text-center"
                        style={{ width: "70px" }}
                      />
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => setOptions(prev => ({ 
                          ...prev, 
                          quantity: prev.quantity + 1 
                        }))}
                      >
                        +
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Hủy
        </Button>
        <Button variant="success" onClick={handleAddToCart}>
          Thêm vào giỏ hàng - ${calculateTotalPrice().toFixed(2)}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddToCartModal;