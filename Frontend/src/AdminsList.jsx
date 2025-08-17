import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

const AdminsList = () => {
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    email: "",
    password: "",
  });

  // Fetch admins from backend
  const fetchAdmins = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/list?type=admins");
      const data = await res.json();
      setAdmins(data.list || []);
      setFilteredAdmins(data.list || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Filter admins based on search
  useEffect(() => {
    const filtered = admins.filter((a) =>
      a.email.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredAdmins(filtered);
  }, [search, admins]);

  const handleAddAdminChange = (e) =>
    setNewAdmin({ ...newAdmin, [e.target.name]: e.target.value });

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newAdmin, role: "Admin" }), 
      });
      const data = await res.json();
      alert(data.message);
      setShowAddModal(false);
      setNewAdmin({ email: "", password: "" });
      fetchAdmins();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="p-4 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Admins List</h2>
          <button
            className="btn btn-success"
            onClick={() => setShowAddModal(true)}
          >
            Add Admin
          </button>
        </div>

        <input
          type="text"
          placeholder="Search by Email..."
          className="form-control mb-3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="table-responsive">
  <table className="table table-striped shadow-sm">
    <thead className="table-light">
      <tr>
        <th className="text-center" style={{ width: "20%" }}>ID</th>
        <th className="text-center" style={{ width: "50%" }}>Email</th>
      </tr>
    </thead>
    <tbody>
      {filteredAdmins.map((a) => (
        <tr key={a.id}>
          <td className="text-center">{a.id}</td>
          <td className="text-center">{a.email}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
        {showAddModal && (
          <div
            className="modal d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setShowAddModal(false)}
          >
            <div
              className="modal-dialog"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content shadow">
                <div className="modal-header">
                  <h5 className="modal-title">Add New Admin</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAddModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleAddAdmin}>
                    <div className="mb-3">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        name="email"
                        value={newAdmin.email}
                        onChange={handleAddAdminChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        name="password"
                        value={newAdmin.password}
                        onChange={handleAddAdminChange}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-success w-100">
                      Add Admin
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminsList;
