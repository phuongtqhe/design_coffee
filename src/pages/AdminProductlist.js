import { useEffect, useState } from "react";
import { Badge, Button, Col, Form, Row, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import Paginate from "../admin/components/Paginate";
// use native fetch for compatibility with server headers

const AdminProductlist = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [nameSearch, setNameSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState();
  const [categoryId, setCategoryId] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    axios.get("http://localhost:9999/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const fetchProducts = async (page) => {
    try {
      // Build URL with query params. Use per_page for newer json-server pagination, keep page param.
      const perPage = 10;
      let url = `http://localhost:9999/products/?_sort=id&_order=desc&_page=${page}&_per_page=${perPage}`;
      if (nameSearch) url += `&title_like=${encodeURIComponent(nameSearch)}`;
      if (statusFilter) url += `&status=${encodeURIComponent(statusFilter)}`;
      if (categoryId) url += `&categoryId=${encodeURIComponent(categoryId)}`;

      const res = await fetch(url, { method: 'GET' });
      const json = await res.json();

      // New pagination style: response body contains pagination meta and `data` array
      if (json && Array.isArray(json.data)) {
        setProducts(json.data || []);
        const pages = json.pages || json.last || Math.ceil((json.items || json.data.length) / perPage);
        setTotalPages(Math.max(1, Number(pages) || 1));
        return;
      }

      // Fallback to older style: body is array and header X-Total-Count
      const totalHeader = res.headers.get('X-Total-Count');
      setProducts(Array.isArray(json) ? json : (json || []));

      const totalNum = totalHeader ? Number(totalHeader) : NaN;
      if (Number.isFinite(totalNum) && totalNum > 0) {
        setTotalPages(Math.max(1, Math.ceil(totalNum / perPage)));
        return;
      }

      // Last fallback: request full list without pagination to compute count
      let countUrl = `http://localhost:9999/products/?_sort=id&_order=desc`;
      if (nameSearch) countUrl += `&title_like=${encodeURIComponent(nameSearch)}`;
      if (statusFilter) countUrl += `&status=${encodeURIComponent(statusFilter)}`;
      if (categoryId) countUrl += `&categoryId=${encodeURIComponent(categoryId)}`;
      const r2 = await fetch(countUrl, { method: 'GET' });
      const all = await r2.json();
      const total = Array.isArray(all) ? all.length : (Array.isArray(json) ? json.length : 0);
      setTotalPages(Math.max(1, Math.ceil(total / perPage)));
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
      setTotalPages(0);
      setProducts([]);
    }
  };


  // Fetch products whenever page or filters change
  useEffect(() => {
    fetchProducts(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, nameSearch, statusFilter, categoryId]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleDeleteProduct = (productId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProduct(productId);
      }
    });
  };

  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:9999/products/${productId}`);
      fetchProducts(currentPage);
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const changeStatus = async (productId, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      await axios.patch(`http://localhost:9999/products/${productId}`, {
        status: newStatus,
      });
      fetchProducts(currentPage);
      toast.success("Change status successfully");
    } catch (error) {
      console.error("Error changing status:", error);
      toast.error("Failed to change status");
    }
  };

  const changeFeatured = async (productId, featured) => {
    try {
      await axios.patch(`http://localhost:9999/products/${productId}`, {
        featured: !featured,
      });
      fetchProducts(currentPage);
      toast.success("Change feature successfully");
    } catch (error) {
      console.error("Error changing featured:", error);
      toast.error("Failed to change feature");
    }
  };

  return (
    <Col lg={12}>
      <h3 className="mt-2">Products List</h3>
      <Row className="my-4">
        <Col xs={12} md={4}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Control
              type="text"
              placeholder="Search by name..."
              value={nameSearch}
              onChange={(e) => { setNameSearch(e.target.value); setCurrentPage(1); }}
            />
          </Form.Group>
        </Col>
        <Col xs={12} md={3}>
          <Form.Select
            aria-label="status"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Select status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Form.Select>
        </Col>
        <Col xs={12} md={3}>
          <Form.Select
            aria-label="category"
            value={categoryId}
            onChange={(e) => { setCategoryId(Number(e.target.value)); setCurrentPage(1); }}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col xs={12} md={2} style={{ textAlign: "right" }}>
          <Button variant="primary">
            <Link className="text-white" to={"/admin/product/add-product"}>
              Add Product
            </Link>
          </Button>
        </Col>
      </Row>
      <Table striped bordered hover variant="light">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th className="text-center">Status</th>
            <th className="text-center">Feature</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>
                {p.images && p.images[0] && (
                  <img
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "10px",
                      objectFit: "cover",
                      marginRight: "10px",
                    }}
                    src={p.images[0]}
                    alt={p.title || p.name}
                  />
                )}
                {p.title || p.name}
              </td>
              <td>{p.price?.toLocaleString("vi-VN")} ₫</td>
              <td>
                {categories.find((c) => c.id == p.categoryId)?.name || ""}
              </td>
              <td className="text-center">
                {p.status === "active" || p.status === true ? (
                  <Badge
                    bg="primary"
                    style={{ cursor: "pointer" }}
                    onClick={() => changeStatus(p.id, p.status)}
                  >
                    Active
                  </Badge>
                ) : (
                  <Badge
                    bg="warning"
                    style={{ cursor: "pointer" }}
                    onClick={() => changeStatus(p.id, p.status || "inactive")}
                  >
                    Inactive
                  </Badge>
                )}
              </td>
              <td className="text-center">
                {p.featured === true ? (
                  <Badge
                    bg="primary"
                    style={{ cursor: "pointer" }}
                    onClick={() => changeFeatured(p.id, p.featured)}
                  >
                    Yes
                  </Badge>
                ) : (
                  <Badge
                    bg="warning"
                    style={{ cursor: "pointer" }}
                    onClick={() => changeFeatured(p.id, p.featured)}
                  >
                    No
                  </Badge>
                )}
              </td>
              <td className="text-center">
                <Button variant="primary">
                  <Link className="text-white" to={"/admin/product/" + p.id}>
                    View
                  </Link>
                </Button>
                <Button variant="primary" className="mx-2">
                  <Link
                    className="text-white"
                    to={"/admin/product/edit/" + p.id}
                  >
                    Edit
                  </Link>
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteProduct(p.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {totalPages > 0 && products.length > 0 && (
        <Paginate
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      )}
      {totalPages === 0 && products.length > 0 && (
        <div className="d-flex justify-content-end mb-3">
          <small className="text-muted">
            Showing all products (no pagination available)
          </small>
        </div>
      )}
    </Col>
  );
};

export default AdminProductlist;
