import React, { useEffect, useState } from "react";

const AdminContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 🟢 Lấy dữ liệu từ json-server (port 9999)
  useEffect(() => {
    fetch("http://localhost:9999/contacts?_sort=id&_order=desc")
      .then((res) => res.json())
      .then((data) => {
        setContacts(data);
        setFiltered(data);
      })
      .catch((err) => console.error("Error fetching contacts:", err));
  }, []);

  // 🟡 Tìm kiếm + Lọc
  useEffect(() => {
    let data = [...contacts];

    // Tìm theo email
    if (searchEmail.trim() !== "") {
      data = data.filter((c) =>
        c.email.toLowerCase().includes(searchEmail.toLowerCase())
      );
    }

    // Lọc theo status
    if (filterStatus !== "all") {
      data = data.filter((c) => c.status === filterStatus);
    }

    setFiltered(data);
    setCurrentPage(1);
  }, [searchEmail, filterStatus, contacts]);

  // 🧮 Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentContacts = filtered.slice(startIndex, startIndex + itemsPerPage);

  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Contact List Management</h2>

      {/* Bộ lọc */}
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by email..."
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Bảng danh sách */}
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-3 py-2 text-center">#</th>
            <th className="border px-3 py-2 text-left">Name</th>
            <th className="border px-3 py-2 text-left">Email</th>
            <th className="border px-3 py-2 text-left">Subject</th>
            <th className="border px-3 py-2 text-left">Message</th>
            <th className="border px-3 py-2 text-center">Status</th>
            <th className="border px-3 py-2 text-center">Created At</th>
          </tr>
        </thead>
        <tbody>
          {currentContacts.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-4">
                No contacts found.
              </td>
            </tr>
          ) : (
            currentContacts.map((c, index) => (
              <tr key={c.id}>
                <td className="border px-3 py-2 text-center">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="border px-3 py-2">{c.name}</td>
                <td className="border px-3 py-2">{c.email}</td>
                <td className="border px-3 py-2">{c.subject}</td>
                <td className="border px-3 py-2">{c.message}</td>
                <td className="border px-3 py-2 text-center">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      c.status === "new"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-green-200 text-green-800"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td className="border px-3 py-2 text-center">
                  {new Date(c.createdAt).toLocaleString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <p>
          Page {currentPage} of {totalPages || 1}
        </p>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminContactList;
