import React, { useEffect, useState, useMemo } from "react";
import { Table, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import BlogAddModal from "../components/BlogManagement/BlogAddModal";
import BlogEditModal from "../components/BlogManagement/BlogEditModal";

function BlogList() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 5;

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const fetchData = () => {
    axios.get("http://localhost:9999/blogs").then((res) => setPosts(res.data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredPosts = useMemo(() => {
    let result = [...posts];
    if (search) {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    return result;
  }, [posts, search]);

  const totalPage = Math.ceil(filteredPosts.length / limit);
  const displayedPosts = filteredPosts.slice((page - 1) * limit, page * limit);

  const togglePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPage) setPage(newPage);
  };

  const handleToggleStatus = async (id) => {
    const post = posts.find((x) => x.id === id);
    await axios.patch(`http://localhost:9999/blogs/${id}`, {
      status: post.status === "active" ? "inactive" : "active",
    });

    setPosts(
      posts.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "active" ? "inactive" : "active" }
          : p
      )
    );
  };

  const handleEdit = (post) => {
    setSelectedPost(post);
    setShowEdit(true);
  };

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Danh sách bài viết</h3>
        <Button onClick={() => setShowAdd(true)}>Thêm bài viết mới</Button>
      </div>

      <Row className="mb-3">
        <Col>
          <Form.Control
            placeholder="Tìm theo tiêu đề..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
      </Row>

      <Table bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Hình</th>
            <th>Tiêu đề</th>
            <th>Nội dung</th>
            <th>Trạng thái</th>
            <th width="160px">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {displayedPosts.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>
                <img src={p.image} alt="" width="60" />
              </td>
              <td>{p.title}</td>
              <td>{p.content}</td>
              <td>{p.status}</td>
              <td>
                <Button
                  size="sm"
                  className="me-1"
                  onClick={() => handleToggleStatus(p.id)}
                >
                  Toggle
                </Button>
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => handleEdit(p)}
                >
                  Sửa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex gap-2">
        <Button onClick={() => togglePage(page - 1)}>Trang trước</Button>
        <span className="align-self-center">
          Trang {page}/{totalPage}
        </span>
        <Button onClick={() => togglePage(page + 1)}>Trang sau</Button>
      </div>

      <BlogAddModal
        show={showAdd}
        onHide={() => setShowAdd(false)}
        onSuccess={fetchData}
      />
      <BlogEditModal
        show={showEdit}
        onHide={() => setShowEdit(false)}
        onSuccess={fetchData}
        data={selectedPost}
      />
    </div>
  );
}

export default BlogList;
