import React, { useState, useEffect } from "react";
import { useCart } from "../components/CartContext";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useAuthentication } from "../utils/use-authentication";

export default function Checkout() {
  const { cartItems, total, clearCart } = useCart();
  const { currentUser } = useAuthentication();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    name: "",
    phone: "",
    country: "",
    city: "",
    postalCode: "",
    street: "",
    addressDetail: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [allToppings, setAllToppings] = useState([]);

  useEffect(() => {
      const fetchToppings = async () => {
          try {
              const res = await fetch("http://localhost:9999/toppings");
              const json = await res.json();
              setAllToppings(json);
          } catch (error) {
              console.error("Error fetching toppings:", error);
          }
      };
      fetchToppings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Check empty fields (bỏ qua email vì sẽ xử lý riêng)
    Object.keys(form).forEach(key => {
      if (key === 'email') return; // Xử lý email riêng ở dưới
      
      if (!form[key].trim()) {
        newErrors[key] = "Trường này không được để trống";
      }
    });

    // Validate phone number (Vietnamese format)
    const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
    if (form.phone && !phoneRegex.test(form.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ (VD: 0912345678)";
    }

    // Validate email (bắt buộc cho guest user)
    if (!currentUser) {
      if (!form.email.trim()) {
        newErrors.email = "Email là bắt buộc";
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
          newErrors.email = "Email không hợp lệ";
        }
      }
    }

    // Validate postal code
    const postalCodeRegex = /^[0-9]{5,6}$/;
    if (form.postalCode && !postalCodeRegex.test(form.postalCode)) {
      newErrors.postalCode = "Mã bưu điện phải là 5-6 chữ số";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Giỏ hàng trống!");
      return;
    }

    setLoading(true);

    try {
      // Prepare order data to match required output
      const now = new Date();
      const orderedDate = now.toISOString().slice(0, 10); // YYYY-MM-DD
      const orderedTime = now.toTimeString().slice(0, 8); // HH:mm:ss
      const orderData = {
        userId: currentUser?.id ? String(currentUser.id) : null,
        receiver: {
          fullName: form.name,
          email: currentUser?.email || form.email || "",
          mobile: form.phone,
          address: {
            country: form.country,
            city: form.city,
            zipcode: form.postalCode,
            street: form.street,
            detailAddress: form.addressDetail
          }
        },
        totalPrice: total,
        status: "pending",
        orderedDate,
        orderedTime
      };

      // Create order first
      const orderResponse = await fetch("http://localhost:9999/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!orderResponse.ok) {
        throw new Error("Lỗi khi tạo đơn hàng");
      }

      const savedOrder = await orderResponse.json();
      const orderId = savedOrder.id;

      // Create order items separately
      const orderItemPromises = cartItems.map(item => {
        // Convert topping names to IDs
        const convertedToppingIds = (item.toppings || []).map(toppingName => {
            const topping = allToppings.find(t => t.name === toppingName);
            return topping ? String(topping.id) : null;
        }).filter(id => id !== null);

        const orderItemData = {
          orderId: orderId,
          productId: String(item.productId),
          quantity: item.quantity,
          unitPrice: item.price,
          toppingIds: convertedToppingIds,
          iceLevel: item.iceLevel,
          sugarLevel: item.sugarLevel,
          totalCost: item.totalPrice
        };
        return fetch("http://localhost:9999/orderItems", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderItemData),
        });
      });

      // Wait for all order items to be created
      const orderItemResponses = await Promise.all(orderItemPromises);
      
      // Check if all order items were created successfully
      for (const response of orderItemResponses) {
        if (!response.ok) {
          throw new Error("Lỗi khi tạo chi tiết đơn hàng");
        }
      }

      // Clear cart and show success
      clearCart();
      toast.success("Đặt hàng thành công!");
      
      // Redirect to order confirmation or home
      navigate("/", { 
        state: { 
          message: `Đơn hàng #${savedOrder.id} đã được tạo thành công!`,
          orderId: savedOrder.id 
        } 
      });

    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <Alert variant="warning">
              <h4>Giỏ hàng trống!</h4>
              <p>Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.</p>
              <Button variant="primary" onClick={() => navigate("/products")}>
                Tiếp tục mua sắm
              </Button>
            </Alert>
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
              <h4 className="mb-0">Thông tin thanh toán</h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  {/* Customer Information */}
                  <Col md={6}>
                    <h6 className="mb-3 text-primary">Thông tin khách hàng</h6>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Họ và tên *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        isInvalid={!!errors.name}
                        placeholder="Nhập họ và tên đầy đủ"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Số điện thoại *</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        isInvalid={!!errors.phone}
                        placeholder="VD: 0912345678"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.phone}
                      </Form.Control.Feedback>
                    </Form.Group>

                    {/* Email field - cho cả guest và logged user */}
                    <Form.Group className="mb-3">
                      <Form.Label>Email *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={currentUser ? currentUser.email : form.email}
                        onChange={handleChange}
                        isInvalid={!!errors.email}
                        placeholder="email@example.com"
                        disabled={!!currentUser} // Chỉ disable khi đã đăng nhập
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                      {currentUser && (
                        <Form.Text className="text-muted">
                          Email của tài khoản đã đăng nhập
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>

                  {/* Shipping Address */}
                  <Col md={6}>
                    <h6 className="mb-3 text-primary">Địa chỉ giao hàng</h6>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Quốc gia *</Form.Label>
                      <Form.Control
                        type="text"
                        name="country"
                        value={form.country}
                        onChange={handleChange}
                        isInvalid={!!errors.country}
                        placeholder="VD: Việt Nam"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.country}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Row>
                      <Col md={8}>
                        <Form.Group className="mb-3">
                          <Form.Label>Thành phố *</Form.Label>
                          <Form.Control
                            type="text"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            isInvalid={!!errors.city}
                            placeholder="VD: Hà Nội"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.city}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Mã bưu điện *</Form.Label>
                          <Form.Control
                            type="text"
                            name="postalCode"
                            value={form.postalCode}
                            onChange={handleChange}
                            isInvalid={!!errors.postalCode}
                            placeholder="VD: 10000"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.postalCode}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Đường/Phố *</Form.Label>
                      <Form.Control
                        type="text"
                        name="street"
                        value={form.street}
                        onChange={handleChange}
                        isInvalid={!!errors.street}
                        placeholder="VD: Đường Láng"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.street}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Địa chỉ chi tiết *</Form.Label>
                      <Form.Control
                        type="text"
                        name="addressDetail"
                        value={form.addressDetail}
                        onChange={handleChange}
                        isInvalid={!!errors.addressDetail}
                        placeholder="VD: Số 123, Ngõ 456"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.addressDetail}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <hr />
                <div className="d-flex justify-content-between">
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => navigate("/cart")}
                    disabled={loading}
                  >
                    Quay lại giỏ hàng
                  </Button>
                  <Button 
                    variant="success" 
                    type="submit" 
                    disabled={loading}
                    className="px-4"
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Đang xử lý...
                      </>
                    ) : (
                      "Xác nhận thanh toán"
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Order Summary */}
        <Col lg={4}>
          <Card className="sticky-top" style={{ top: "20px" }}>
            <Card.Header>
              <h5 className="mb-0">Đơn hàng của bạn</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="d-flex justify-content-between mb-2 pb-2 border-bottom">
                    <div className="flex-grow-1">
                      <h6 className="mb-1 small">{item.name}</h6>
                      <div className="small text-muted">
                        <div>Số lượng: {item.quantity}</div>
                        <div>Đá: {item.iceLevel} | Ngọt: {item.sugarLevel}</div>
                        {item.toppings?.length > 0 && (
                          <div>Topping: {item.toppings.join(", ")}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="small text-muted">${item.price} × {item.quantity}</div>
                      <div className="fw-bold">${item.totalPrice.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span>Tạm tính:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Phí vận chuyển:</span>
                <span className="text-success">Miễn phí</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Thuế:</span>
                <span>$0.00</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Tổng cộng:</strong>
                <strong className="text-primary">${total.toFixed(2)}</strong>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}