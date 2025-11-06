import { useEffect, useState } from "react";
import { Badge, Button, Col, Form, Row, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import Paginate from "../admin/components/Paginate";
// use native fetch for compatibility with server headers

const AdminProductlist = () => {
  const [allProducts, setAllProducts] = useState([]); // Stores all products from server
  const [products, setProducts] = useState([]); // Stores paginated products for display
  const [categories, setCategories] = useState([]);
  const [nameSearch, setNameSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const perPage = 10;

  // Effect to fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get("http://localhost:9999/products"),
          axios.get("http://localhost:9999/categories"),
        ]);
        setAllProducts(productsRes.data.sort((a, b) => b.id - a.id)); // Sort by ID desc initially
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Failed to fetch data");
      }
    };
    fetchData();
  }, []);

  // Effect for filtering and pagination
  useEffect(() => {
    let filteredProducts = [...allProducts];

    // Filter by search term (name or ID)
    if (nameSearch) {
      filteredProducts = filteredProducts.filter(p =>
        (p.title || p.name || "").toLowerCase().includes(nameSearch.toLowerCase()) ||
        String(p.id).toLowerCase().includes(nameSearch.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter) {
      filteredProducts = filteredProducts.filter(p => p.status === statusFilter);
    }

    // Filter by category
    if (categoryId) {
      filteredProducts = filteredProducts.filter(p => String(p.categoryId) === String(categoryId));
    }

    // Calculate pagination
    const newTotalPages = Math.ceil(filteredProducts.length / perPage);
    setTotalPages(newTotalPages);

    // Adjust current page if it's out of bounds
    const newCurrentPage = Math.min(currentPage, newTotalPages) || 1;
    if (currentPage !== newCurrentPage) {
        setCurrentPage(newCurrentPage);
    }

    // Get the items for the current page
    const paginatedProducts = filteredProducts.slice((newCurrentPage - 1) * perPage, newCurrentPage * perPage);
    setProducts(paginatedProducts);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allProducts, nameSearch, statusFilter, categoryId, currentPage]);

  const refetchAllProducts = async () => {
    try {
        const productsRes = await axios.get("http://localhost:9999/products");
        setAllProducts(productsRes.data.sort((a, b) => b.id - a.id));
    } catch (error) {
        toast.error("Failed to refresh product data.");
    }
  };


  // Fetch products whenever page or filters change
  useEffect(() => {
    // This effect is now primarily for logging or potential future side-effects when filters change.
    // The main logic is handled in the effect above.
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
      toast.success("Product deleted successfully");
      refetchAllProducts();
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
      toast.success("Change status successfully");
      refetchAllProducts();
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
      toast.success("Change feature successfully");
      refetchAllProducts();
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
              placeholder="Search by name or ID..."
              value={nameSearch}
              onChange={(e) => {
                setNameSearch(e.target.value);
                setCurrentPage(1);
              }}
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
            onChange={(e) => { setCategoryId(e.target.value); setCurrentPage(1); }}
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
