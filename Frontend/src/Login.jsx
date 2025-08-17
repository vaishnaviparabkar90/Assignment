import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserAlt, FaLock, FaSignInAlt } from "react-icons/fa"; // optional icons

const Login = () => {
  const [role, setRole] = useState("User"); // default role
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  
  try {
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message);
    alert(data.message); 
    console.log("User data:", data.user);
    // Store login state and user info
localStorage.setItem("isLoggedIn", "true");
localStorage.setItem("userEmail", email);
localStorage.setItem("userRole", role);
    if (role === "Admin") navigate("/admin-dashboard");
    else if (role === "User") navigate("/user-dashboard");
    else if (role === "Store") navigate("/store-dashboard");

  } catch (err) {
    
    alert(`Login failed: ${err.message}`);
  }
};


  return (
    <div className="d-flex vh-100 justify-content-center align-items-center" style={{ background: 'linear-gradient(135deg, #4c6af3ff, #d1c3dfff)' }}>
      <div className="card shadow-lg p-4 p-md-5 rounded-4" style={{ width: "400px", backgroundColor: "#fff" }}>
        <div className="text-center mb-4">
          <h3 className="fw-bold text-success">Welcome Back</h3>
          <p className="text-muted">Login to your account</p>
        </div>

        <div className="mb-4 text-center">
  <p className="fw-semibold mb-2 text-muted">Select your role</p>
  <div className="d-flex justify-content-around">
   
    <button
      type="button"
      className={`btn ${role === "Admin" ? "btn-success" : "btn-outline-success"} w-100 mx-1`}
      style={{ borderRadius: "12px" }}
      onClick={() => setRole("Admin")}
    >
      System Admin
    </button>

    
    <button
      type="button"
      className={`btn ${role === "User" ? "btn-success" : "btn-outline-success"} w-100 mx-1`}
      style={{ borderRadius: "12px" }}
      onClick={() => setRole("User")}
    >
      Normal User
    </button>
    <button
      type="button"
      className={`btn ${role === "Store" ? "btn-success text-white" : "btn-outline-success"} w-100 mx-1`}
      style={{ borderRadius: "12px" }}
      onClick={() => setRole("Store")}
    >
      Store Owner
    </button>
  </div>
</div>
        <div className="input-group mb-3">
          <span className="input-group-text bg-success text-white"><FaUserAlt /></span>
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-group mb-4">
          <span className="input-group-text bg-success text-white"><FaLock /></span>
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          className="btn btn-success w-100 fw-bold mb-3 d-flex align-items-center justify-content-center"
          onClick={handleLogin}
        >
          <FaSignInAlt className="me-2" /> Login
        </button>
        {role === "User" && (
          <div className="text-center">
            <span className="text-muted">Don't have an account? </span>
            <button
              className="btn btn-link fw-semibold p-0"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
