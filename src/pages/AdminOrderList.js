import React, { useState, useEffect } from "react";
import { Card, Badge, Button, Modal, Table, Row, Col, InputGroup, Form, Container } from "react-bootstrap";
import { AiFillCaretRight } from "react-icons/ai";
import { toast } from 'react-toastify';


export default function AdminOrderList() {
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [lgShow, setLgShow] = useState(false);
  const [currentDetail, setCurrentDetail] = useState(null);
  // 5 statuses: pending, onGoing, success, fail, canceled
  const statusNames = ["pending", "onGoing", "success", "fail", "canceled"];
  const effectBadge = ["warning", "info", "success", "danger", "secondary"];
  const colorBadge = ["#f7c873", "#6ec6ff", "#7be495", "#ff7b7b", "#bdbdbd"];

  useEffect(() => {
    fetch(`http://localhost:9999/orders`)
      .then(res => res.json())
      .then(json => setOrders(json));
    fetch(`http://localhost:9999/orderItems`)
      .then(res => res.json())
      .then(json => setOrderItems(json));
    fetch(`http://localhost:9999/status`)
      .then(res => res.json())
      .then(json => setStatusList(json));
  }, []);

  // Filter states
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchDate, setSearchDate] = useState("");

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    const name = o.receiver?.fullName?.toLowerCase() || "";
    const email = o.receiver?.email?.toLowerCase() || "";
    const date = o.orderedDate || "";
    return (
      (!searchName || name.includes(searchName.toLowerCase())) &&
      (!searchEmail || email.includes(searchEmail.toLowerCase())) &&
      (!searchDate || date === searchDate)
    );
  });

  const openDetail = (order) => {
    setCurrentDetail(order);
    setLgShow(true);
  };

  const updateStatus = (order, newStatusId) => {
    fetch(`http://localhost:9999/orders/${order.id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...order, status: statusNames[newStatusId - 1], statusId: Number(newStatusId) }),
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    })
      .then(() => {
        setOrders(orders => orders.map(o => o.id === order.id ? { ...o, status: statusNames[newStatusId - 1], statusId: Number(newStatusId) } : o));
        toast.success('Cập nhật trạng thái thành công');
      })
      .catch(() => toast.error('Lỗi cập nhật trạng thái'));
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-3 align-items-end">
        <Col md={3}>
          <Form.Group>
            <Form.Label>Tìm theo tên</Form.Label>
            <Form.Control type="text" placeholder="Tên khách hàng" value={searchName} onChange={e => setSearchName(e.target.value)} />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Tìm theo email</Form.Label>
            <Form.Control type="text" placeholder="Email" value={searchEmail} onChange={e => setSearchEmail(e.target.value)} />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Lọc theo ngày</Form.Label>
            <Form.Control type="date" value={searchDate} onChange={e => setSearchDate(e.target.value)} />
          </Form.Group>
        </Col>
      </Row>
      <h3 className="mb-4">Orders</h3>
      <Row>
        {filteredOrders.length === 0 && (
          <Col><div className="text-center text-muted">Không có đơn hàng phù hợp.</div></Col>
        )}
        {filteredOrders.map((o, idx) => {
          const itemsForOrder = orderItems.filter(oi => oi.orderId === o.id);
          return (
            <Col md={6} lg={4} key={o.id} className="mb-4">
              <Card className="shadow-sm" style={{ background: colorBadge[o.statusId - 1] }}>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="fw-bold" style={{ color: "#333" }}>ID: {o.id}</span>
                    <Badge className="ms-2" bg={effectBadge[o.statusId - 1]}>{statusList[o.statusId - 1]?.name || o.status}</Badge>
                  </div>
                  <Button size="sm" variant="outline-dark" onClick={() => openDetail(o)}>Chi tiết</Button>
                </Card.Header>
                <Card.Body style={{ background: "white" }}>
                  <div className="mb-2">
                    <span className="fw-bold">Khách:</span> {o.receiver?.fullName || o.name}
                    <br /><span className="text-muted small">{o.receiver?.email}</span>
                  </div>
                  <div className="mb-2">
                    <span className="fw-bold">SĐT:</span> (+1) {o.receiver?.mobile || o.phone}
                  </div>
                  <div className="mb-2">
                    <span className="fw-bold">Địa chỉ:</span> {'zipcode: ' + (o.receiver?.address?.zipcode || o.address?.zipcode) + ', ' + (o.receiver?.address?.detailAddress || o.address?.detailAddress) + ', ' + (o.receiver?.address?.city || o.address?.city) + ', ' + (o.receiver?.address?.country || o.address?.country)}
                  </div>
                  <div className="mb-2">
                    <span className="fw-bold">Ngày đặt:</span> {o.orderedDate} <span className="ms-2">{o.orderedTime}</span>
                  </div>
                  <div className="mb-2">
                    <span className="fw-bold">Sản phẩm:</span> {itemsForOrder.length} x sản phẩm
                  </div>
                  <div className="mb-2">
                    <span className="fw-bold">Tổng tiền:</span> <span className="text-success">{o.totalPrice ? o.totalPrice.toLocaleString('vi-VN') + ' ₫' : ''}</span>
                  </div>
                  <InputGroup className="mt-3">
                    <InputGroup.Text>Thay đổi trạng thái</InputGroup.Text>
                    <Form.Select
                      value={o.statusId || (statusNames.indexOf(o.status) + 1) || 1}
                      onChange={e => updateStatus(o, e.target.value)}
                    >
                      {(statusList.length > 0 ? statusList : statusNames.map((name, i) => ({ id: i + 1, name }))).map((s, i) => (
                        <option key={s.id || i + 1} value={s.id || i + 1}>{s.name || s}</option>
                      ))}
                    </Form.Select>
                  </InputGroup>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
      <Modal
        size="lg"
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Order id: {currentDetail?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentDetail && (() => {
            const itemsForOrder = orderItems.filter(oi => oi.orderId === currentDetail.id);
            return (
              <Card className="m-2">
                <Card.Header style={{ background: colorBadge[currentDetail.statusId - 1] }}>
                  <div style={{ color: "white" }}>Status</div>
                  <Badge bg={effectBadge[currentDetail.statusId - 1]}>{statusList[currentDetail.statusId - 1]?.name || currentDetail.status}</Badge>
                </Card.Header>
                <Card.Body>
                  <Card.Title>
                    {currentDetail.receiver?.fullName || currentDetail.name} <br />
                    (+1) {currentDetail.receiver?.mobile || currentDetail.phone}
                  </Card.Title>
                  <Card.Text>
                    {'zipcode: ' + (currentDetail.receiver?.address?.zipcode || currentDetail.address?.zipcode) + ', ' + (currentDetail.receiver?.address?.detailAddress || currentDetail.address?.detailAddress) + ', ' + (currentDetail.receiver?.address?.city || currentDetail.address?.city) + ', ' + (currentDetail.receiver?.address?.country || currentDetail.address?.country)}
                  </Card.Text>
                  <Card.Text>
                    {itemsForOrder.length + ' x sản phẩm'}
                  </Card.Text>
                  <Card.Text>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>No.</th>
                          <th>Product ID</th>
                          <th>Name</th>
                          <th>Quantity</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {itemsForOrder.map((p, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td><Button onClick={() => { window.location = `/product/${p.productId}` }} type='button' style={{ minWidth: "10ch" }} className='btn btn-dark'>{p.productId} <AiFillCaretRight className='m-0' /></Button></td>
                            <td>{p.productName || p.name || ''}</td>
                            <td>{p.quantity}</td>
                            <td>{p.unitPrice ? (p.unitPrice * p.quantity).toLocaleString('vi-VN') + ' ₫' : ''}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Text>
                  <Card.Text>
                    <p style={{ fontWeight: "bold" }}>Tổng tiền:</p>
                    <p style={{ fontWeight: "bold" }}>{currentDetail.totalPrice ? currentDetail.totalPrice.toLocaleString('vi-VN') + ' ₫' : ''}</p>
                  </Card.Text>
                </Card.Body>
              </Card>
            );
          })()}
        </Modal.Body>
      </Modal>
    </Container>
  );
}
