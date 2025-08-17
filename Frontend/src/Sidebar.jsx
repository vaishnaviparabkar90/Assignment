import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
localStorage.removeItem("userEmail");
localStorage.removeItem("userRole");
    alert("Logged out!");
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `nav-link d-flex align-items-center px-3 py-2 mb-2 rounded ${
      isActive ? "bg-success text-white fw-bold" : "text-dark"
    }`;

  return (
    <div
      className="bg-light vh-100 p-3 d-flex flex-column shadow"
      style={{ width: "300px" }}
    >
      <h4 className="text-center mb-4 fw-bold">Admin Panel</h4>
      <nav className="flex-column nav flex-grow-1">
        <NavLink to="/dashboard" className={linkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/users-list" className={linkClass}>
          Users List
        </NavLink>
        <NavLink to="/stores-list" className={linkClass}>
          Stores List
        </NavLink>
        <NavLink to="/Admin-list" className={linkClass}>
          Admin  List
        </NavLink>
      </nav>
      <button
        className="btn btn-danger w-90"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
