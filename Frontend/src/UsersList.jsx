import  { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/list?type=users");
      const data = await res.json();
      setUsers(data.list || []);
      setFilteredUsers(data.list || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search
  useEffect(() => {
    const filtered = users.filter((u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.address && u.address.toLowerCase().includes(search.toLowerCase()))
    );
    setFilteredUsers(filtered);
  }, [search, users]);

  const handleAddUserChange = (e) =>
    setNewUser({ ...newUser, [e.target.name]: e.target.value });

  const handleAddUser = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch("http://localhost:5000/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newUser, role: "User" }), // ← add role here
    });
    const data = await res.json();
    alert(data.message);
    setShowAddModal(false);
    setNewUser({ name: "", email: "", address: "", password: "" });
    fetchUsers();
  } catch (err) {
    console.error(err);
  }
};


  return (
    <div className="d-flex">
      <Sidebar />
      <div className="p-4 flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Users List</h2>
          <button
            className="btn btn-success"
            onClick={() => setShowAddModal(true)}
          >
            Add User
          </button>
        </div>

        <input
          type="text"
          placeholder="Search by Name, Email, Address..."
          className="form-control mb-3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="table-responsive">
          <table className="table table-striped shadow-sm">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.address}</td>
                 
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add User Modal */}
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
                  <h5 className="modal-title">Add New User</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowAddModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleAddUser}>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        name="name"
                        value={newUser.name}
                        onChange={handleAddUserChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        name="email"
                        value={newUser.email}
                        onChange={handleAddUserChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Address"
                        name="address"
                        value={newUser.address}
                        onChange={handleAddUserChange}
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        name="password"
                        value={newUser.password}
                        onChange={handleAddUserChange}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-success w-100">
                      Add User
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

export default UsersList;
