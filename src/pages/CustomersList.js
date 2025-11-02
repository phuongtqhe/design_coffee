// src/pages/CustomersList.js
import { useEffect, useState } from "react";

export default function CustomersList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc"); // asc = A→Z, desc = Z→A

  useEffect(() => {
    fetch("http://localhost:3001/users")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((u) => u.role && u.role.toLowerCase() === "customer");
        setCustomers(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy dữ liệu:", err);
        setLoading(false);
      });
  }, []);

  const sortByName = () => {
    const sorted = [...customers].sort((a, b) => {
      const nameA = (a.name || "").toLowerCase();
      const nameB = (b.name || "").toLowerCase();
      return sortOrder === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
    setCustomers(sorted);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="h4 mb-0">Customers List</h2>

        {/* Bootstrap button + inline style to guarantee color */}
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
          <span style={{ fontSize: 16 }}>{sortOrder === "asc" ? "↑" : "↓"}</span>
        </button>
      </div>

      {customers.length === 0 ? (
        <p className="text-muted">No Customers in the list</p>
      ) : (
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-bordered mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: 60 }} className="text-center align-middle">#</th>
                <th style={{ width: 90 }} className="text-center align-middle">Picture</th>
                <th className="align-middle">Name</th>
                <th className="align-middle">Email</th>
                <th style={{ width: 110 }} className="text-center align-middle">Role</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c, index) => (
                <tr key={c.id || index}>
                  <td className="text-center align-middle">{index + 1}</td>
                  <td className="text-center align-middle">
                    <img
                      src={c.picture || "https://via.placeholder.com/50"}
                      alt={c.name}
                      style={{ width: 48, height: 48, objectFit: "cover", borderRadius: "50%", border: "1px solid #e9ecef" }}
                    />
                  </td>
                  <td className="align-middle">{c.name}</td>
                  <td className="align-middle">{c.email}</td>
                  <td className="text-center align-middle">
                    <span className="badge bg-secondary text-white" style={{ textTransform: "capitalize" }}>
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
