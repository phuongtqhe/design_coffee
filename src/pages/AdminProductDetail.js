import React, { useState, useEffect } from "react";
import { Badge, Button, Col, Container, Row } from "react-bootstrap";
import ReactStars from "react-rating-stars-component";
import { Link, useParams } from "react-router-dom";

const AdminProductDetail = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [users, setUsers] = useState([]);
  const [mainImage, setMainImage] = useState([]);
  const { images } = products;

  useEffect(
    () => {
      fetch(`http://localhost:9999/products/` + id)
        .then(res => res.json())
        .then(
          json => {
            setProducts(json);
          }
        );
    }, [id]
  );

  useEffect(
    () => {
      fetch(`http://localhost:9999/feedbacks/?productId=` + id)
        .then(res => res.json())
        .then(
          json => {
            setFeedbacks(json);
          }
        );
    }, []
  );

  useEffect(
    () => {
      fetch(`http://localhost:9999/users`)
        .then(res => res.json())
        .then(
          json => {
            setUsers(json);
          }
        );
    }, []
  );

  useEffect(
    () => {
      setMainImage(images ? images[0] : "not chosen");
      if (document.getElementById("btnradio0")) document.getElementById("btnradio0").setAttribute("checked", true);
    }, [images]
  );

  const smallImageStyle = {
    boxShadow: "0px 2px 7px 0px",
  };

  const formatConfiguration = (input) => { //format configuration text
    const [label, value] = input.split(': ');
    return (
      <>
        <td style={{ fontWeight: "bold" }}>{label}</td>
        <td>{value}</td>
      </>
    );
  }

  return (
    <>
      <Container class1="main-product-wrapper py-5 home-wrapper-2 mt-2" style={{ marginBottom: "15px" }}>
        <div className="row">
          <div className="col-12 my-3" style={{ textAlign: "right" }}>
            <Button className="btn-primary mx-2"><Link className="text-white" to={'/admin/product/edit/' + id}>Edit</Link></Button>
            <Button className="btn-danger"><Link className="text-white" to={'/admin/product'}>Back to list</Link></Button>
          </div>
          <div className="col-7 row">

            <div className="d-flex flex-column col-2">
              {images && images.length > 0 && images.map((img) =>
                <div key={img} className="mb-2" >
                  <button className="btn" onClick={() => setMainImage(img)}>
                    <img src={img} alt="product" style={{ width: "95%" }} />
                  </button>
                </div>
              )}
            </div>
            <div className="mb-5 col-10">
              {images && images.length > 0 && (
                <img src={mainImage} alt="product" style={{ width: "95%" }} />
              )}
            </div>

            <h3>Product detailed description</h3>
            <div className="py-4 px-2" style={{ background: "white" }}>
              <p>{products.description}</p>
            </div>


          </div>
          <div className="col-5">
            <div className="main-product-details">
              <div className="border-bottom">
                <h2 className="title">
                  {products.title}
                </h2>
                <Row className="mb-3">
                  <Col xs={12}>
                    Status: {products.status === 'active' || products.status === true ? (
                      <Badge bg="primary"> Active </Badge>
                    ) : (
                      <Badge bg="warning"> Inactive </Badge>
                    )}
                    <span style={{ marginLeft: "10px" }}>Featured: </span>{products.featured === true ? (
                      <Badge bg="primary"> Yes</Badge>
                    ) : (
                      <Badge bg="warning"> No</Badge>
                    )}
                  </Col>
                </Row>
              </div>
              <div className="border-bottom py-3">
                <p className="price">Price: {products.price?.toLocaleString("vi-VN")} ₫</p>
                <p className="price">Original Price: {products.originPrice?.toLocaleString("vi-VN")} ₫</p>
                {/* <div className="d-flex align-items-center gap-10">
                  <ReactStars
                    count={5}
                    size={24}
                    value={4}
                    edit={false}
                    activeColor="#ffd700"
                  />
                  <p className="mb-0 t-review">( {feedbacks.length} Reviews )</p>
                </div> */}
              </div>
            </div>



          </div>
        </div>
      </Container>

      
    </>
  );
};

export default AdminProductDetail;
