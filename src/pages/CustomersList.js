import React, { useEffect, useState, useRef } from "react";

export default function CustomersList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc"); // asc = A→Z, desc = Z→A
  const fetched = useRef(false); // đảm bảo chỉ fetch 1 lần duy nhất

  useEffect(() => {
    if (fetched.current) return; // Ngăn fetch lại khi re-render
    fetched.current = true;

    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:9999/users");
        const data = await res.json();

        // Lọc chỉ lấy customer
        const filtered = data.filter(
          (u) => u.role && u.role.toLowerCase() === "customer"
        );

        // Loại bỏ các bản ghi trùng email (tránh nhân bản)
        const unique = filtered.filter(
          (user, index, self) =>
            index === self.findIndex((u) => u.email === user.email)
        );

        setCustomers(unique);
      } catch (err) {
        console.error("❌ Lỗi khi lấy dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sortByName = () => {
    const sorted = [...customers].sort((a, b) => {
      const nameA = (a.name || "").toLowerCase();
      const nameB = (b.name || "").toLowerCase();
      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

    setCustomers(sorted);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3 text-muted">Đang tải danh sách khách hàng...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="h4 mb-0">Customers List</h2>

        <button
          onClick={sortByName}
          className="btn btn-primary d-flex align-items-center"
          style={{
            boxShadow: "0 4px 8px rgba(13,110,253,0.15)",
            borderRadius: 8,
            padding: "8px 14px",
            fontWeight: 600,
          }}
        >
          <span style={{ marginRight: 8 }}>Sort by Name</span>
          <span style={{ fontSize: 16 }}>
            {sortOrder === "asc" ? "↑" : "↓"}
          </span>
        </button>
      </div>

      {customers.length === 0 ? (
        <p className="text-muted">No customers found.</p>
      ) : (
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-bordered mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: 60 }} className="text-center align-middle">
                  #
                </th>
                <th style={{ width: 90 }} className="text-center align-middle">
                  Picture
                </th>
                <th className="align-middle">Name</th>
                <th className="align-middle">Email</th>
                <th
                  style={{ width: 110 }}
                  className="text-center align-middle"
                >
                  Role
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c, index) => (
                <tr key={c.id || c.email || index}>
                  <td className="text-center align-middle">{index + 1}</td>
                  <td className="text-center align-middle">
                    <img
                      src={c.picture || "https://via.placeholder.com/50"}
                      alt={c.name || "Customer"}
                      style={{
                        width: 48,
                        height: 48,
                        objectFit: "cover",
                        borderRadius: "50%",
                        border: "1px solid #e9ecef",
                      }}
                    />
                  </td>
                  <td className="align-middle">{c.name}</td>
                  <td className="align-middle">{c.email}</td>
                  <td className="text-center align-middle">
                    <span
                      className="badge bg-secondary text-white"
                      style={{ textTransform: "capitalize" }}
                    >
                      {c.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
