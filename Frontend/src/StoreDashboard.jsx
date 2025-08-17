import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const StoreDashboard = () => {
  const navigate = useNavigate();
  const [ratings, setRatings] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
  const [showModal, setShowModal] = useState(false);

  const storeEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!storeEmail) {
      alert("No store email found. Please log in again.");
      navigate("/login");
      return;
    }

    fetch(`http://localhost:5000/api/store/${encodeURIComponent(storeEmail)}/dashboard`)
      .then(res => res.json())
      .then(data => {
        setRatings(data.ratings || []);
        setAvgRating(data.avg_rating || 0);
      })
      .catch(err => console.error("[Dashboard] Fetch error:", err));
  }, [storeEmail, navigate]);

  const updatePassword = async () => {
    if (!passwords.oldPassword || !passwords.newPassword) {
      return alert("Please fill both old and new password.");
    }

    try {
      const res = await fetch("/api/store/update-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeEmail, ...passwords }),
      });
      const data = await res.json();
      alert(data.message || "Password updated.");
      setPasswords({ oldPassword: "", newPassword: "" });
      setShowModal(false);
    } catch (err) {
      console.error("[UpdatePassword] Error:", err);
      alert("Failed to update password.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-outline-success" onClick={() => setShowModal(true)}>
          Update Password
        </button>
        <h2>Store Dashboard</h2>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Two-column layout */}
      <div className="row">
        {/* Left Column - Average Rating */}
      <div className="col-md-4 mb-4">
  <div
    className="card shadow-lg text-center d-flex flex-column justify-content-center align-items-center"
    style={{
      height: "500px",
      background: "linear-gradient(135deg, #f9f9f9, #eaf4ff)", // light gradient
      borderRadius: "40px",
    }}
  >
    <h4 className="mb-3" style={{ fontSize: "2rem", fontWeight: "600", color: "#333" }}>
      Average Rating
    </h4>
    <p style={{ fontSize: "4rem", fontWeight: "700", color: "#ffb400" }}>
      ⭐ {avgRating}
    </p>
  </div>
</div>


        {/* Right Column - Ratings List */}
<div className="col-md-8 mb-4">
  <div
    className="card shadow-lg p-4"
    style={{
      
       height: "500px",           // 👈 fixed height
    overflowY: "auto",
      background: "linear-gradient(135deg, #ffffff, #f4f9ff)", // soft gradient
    }}
  >
    <h4 className="mb-4 text-center" style={{ fontWeight: "600", color: "#333" }}>
      Users who rated your store
    </h4>

    {ratings.length === 0 ? (
      <p className="text-muted text-center">No ratings yet.</p>
    ) : (
      <ul className="list-group list-group-flush">
        {ratings.map(r => (
          <li
            key={r.id}
            className="list-group-item d-flex justify-content-between align-items-center py-3"
            style={{
              border: "none",
              borderBottom: "1px solid #e9ecef",
            }}
          >
            <span style={{ fontSize: "1.1rem", fontWeight: "500" }}>
              {r.user_name} <span className="text-muted">(ID: {r.user_id})</span>
            </span>
            <span
              className="badge rounded-pill"
              style={{
                backgroundColor: "#ffeb99",
                color: "#333",
                fontSize: "1rem",
                padding: "10px 15px",
              }}
            >
              ⭐ {r.rating}
            </span>
          </li>
        ))}
      </ul>
    )}
  </div>
</div>

      </div>

      {/* Password Update Modal */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow">
              <div className="modal-header">
                <h5 className="modal-title">Update Password</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="password"
                  placeholder="Old Password"
                  className="form-control mb-2"
                  value={passwords.oldPassword}
                  onChange={e =>
                    setPasswords({ ...passwords, oldPassword: e.target.value })
                  }
                />
                <input
                  type="password"
                  placeholder="New Password"
                  className="form-control mb-2"
                  value={passwords.newPassword}
                  onChange={e =>
                    setPasswords({ ...passwords, newPassword: e.target.value })
                  }
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-success" onClick={updatePassword}>
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreDashboard;
