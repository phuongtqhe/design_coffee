import React, { useEffect, useState } from "react";
import { Card, Button, Spinner, Badge } from "react-bootstrap";
import axios from "axios";
import { FaMapMarkerAlt } from "react-icons/fa";

function OrderHistoryTab() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const userEmail = localStorage.getItem("email"); // user đang login

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resOrders = await axios.get(
          `http://localhost:9999/orders?userId=${userEmail}`
        );
        const resProducts = await axios.get("http://localhost:9999/products");

        const ordersWithItems = await Promise.all(
          resOrders.data.map(async (order) => {
            const resItems = await axios.get(
              `http://localhost:9999/orderItems?orderId=${order.id}`
            );
            return { ...order, items: resItems.data };
          })
        );

        setProducts(resProducts.data);
        setOrders(ordersWithItems);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userEmail]);

  if (loading) return <Spinner animation="border" />;

  const statusColor = {
    pending: "warning",
    preparing: "primary",
    delivering: "info",
    completed: "success",
    cancelled: "danger",
  };

  return (
    <>
      {orders.map((order) => (
        <Card key={order.id} className="border-0 shadow-sm mb-3">
          <Card.Body>
            <h6 className="fw-bold">Order #{order.id}</h6>
            <p className="text-muted mb-1">
              {order.orderedDate} • {order.orderedTime}
            </p>

            {/* ITEMS */}
            {order.items.map((item) => {
              const product = products.find((p) => p.id === item.productId);

              return (
                <div
                  className="d-flex align-items-center mt-3 mb-2"
                  key={item.id}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      backgroundColor: "#F5F5F5",
                      borderRadius: "10px",
                      marginRight: "15px",
                      backgroundImage: `url(${product?.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>
                  <div>
                    <h6 className="fw-bold mb-1">{product?.name}</h6>
                    <p className="text-muted mb-0">
                      Ice: {item.iceLevel} • Sugar: {item.sugarLevel}
                    </p>
                    <small className="text-secondary">x{item.quantity}</small>
                  </div>
                  <div className="ms-auto fw-bold">${item.totalCost}</div>
                </div>
              );
            })}

            <div className="d-flex justify-content-between align-items-center mt-3 border-top pt-2">
              <div className="text-muted">
                <FaMapMarkerAlt className="me-2" />
                {order.receiver.address.street}, {order.receiver.address.city}
              </div>

              <Badge bg={statusColor[order.status]} className="px-3 py-2">
                {order.status.toUpperCase()}
              </Badge>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-3">
              <h6>Total: ${order.totalPrice}</h6>
              <div>
                <Button variant="secondary" className="me-2">
                  View Details
                </Button>
                <Button variant="outline-secondary">Reorder</Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      ))}
    </>
  );
}

export default OrderHistoryTab;
