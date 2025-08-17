import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

const StoresList = () => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStore, setNewStore] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });

  // Fetch stores from backend
  const fetchStores = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/list?type=stores");
      const data = await res.json();
      setStores(data.list || []);
      setFilteredStores(data.list || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  // Filter stores based on search
  useEffect(() => {
    const filtered = stores.filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.address && s.address.toLowerCase().includes(search.toLowerCase()))
    );
    setFilteredStores(filtered);
  }, [search, stores]);

  const handleAddStoreChange = (e) =>
    setNewStore({ ...newStore, [e.target.name]: e.target.value });

  const handleAddStore = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newStore, role: "Store" }),
      });
      const data = await res.json();
      alert(data.message);
      setShowAddModal(false);
      setNewStore({ name: "", email: "", address: "", password: "" });
      fetchStores();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="p-4 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Stores List</h2>
          <button
            className="btn btn-success"
            onClick={() => setShowAddModal(true)}
          >
            Add Store
          </button>
        </div>

        <input
          type="text"
          placeholder="Search by Name, Email, Address..."
          className="form-control mb-3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="table-responsive shadow-sm rounded">
          <table className="table table-striped mb-0 bg-white">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {filteredStores.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.address}</td>
                  <td>{s.rating || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Store Modal */}
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
                  <h5 className="modal-title">Add New Store</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAddModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleAddStore}>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        name="name"
                        value={newStore.name}
                        onChange={handleAddStoreChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        name="email"
                        value={newStore.email}
                        onChange={handleAddStoreChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Address"
                        name="address"
                        value={newStore.address}
                        onChange={handleAddStoreChange}
                      />
                    </div>
        
                    <div className="mb-3">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        name="password"
                        value={newStore.password}
                        onChange={handleAddStoreChange}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-success w-100">
                      Add Store
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

export default StoresList;
