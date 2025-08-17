import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUserAlt, FaEnvelope, FaLock, FaUserPlus, FaAddressCard } from "react-icons/fa";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const validate = () => {
    const newErrors = {};
    if (name.length < 20 || name.length > 60) {
      newErrors.name = "Name must be 20-60 characters.";
    }
    // Address: Max 400
    if (address.length > 400) {
      newErrors.address = "Address cannot exceed 400 characters.";
    }
    // Email: Standard email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format.";
    }
    // Password: 8-16 chars, at least one uppercase & one special character
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
    if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must be 8-16 chars, include 1 uppercase & 1 special char.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  };

  const handleSignup = async(e) => {
    e.preventDefault();
    if (validate()) {
      alert(`Signing up Normal User: ${name}, ${email}`);
      const data = { name, email, address, password };
  const res = await fetch('http://localhost:5000/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  console.log(data); 
  console.log(res);
  const result = await res.json();
   console.log(result.message); // Log any message from the server
  if (res.ok) alert('User created!');
  else alert(result.message);
      navigate("/login");
    }
  };

  return (
    <div
      className="d-flex vh-100 justify-content-center align-items-center"
      style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
    >
      <div
        className="card shadow-lg p-4 p-md-5 rounded-4"
        style={{ width: "450px", backgroundColor: "#fff" }}
      >
        <div className="text-center mb-4">
          <h3 className="fw-bold text-success">Create Account</h3>
          <p className="text-muted">Sign up as a Normal User</p>
        </div>

        <form onSubmit={handleSignup}>
          {/* Full Name */}
          <div className="input-group mb-2">
            <span className="input-group-text bg-success text-white">
              <FaUserAlt />
            </span>
            <input
              type="text"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          {/* Email */}
          <div className="input-group mb-2">
            <span className="input-group-text bg-success text-white">
              <FaEnvelope />
            </span>
            <input
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          {/* Address */}
          <div className="input-group mb-2">
            <span className="input-group-text bg-success text-white">
              <FaAddressCard />
            </span>
            <input
              type="text"
              className={`form-control ${errors.address ? "is-invalid" : ""}`}
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            {errors.address && (
              <div className="invalid-feedback">{errors.address}</div>
            )}
          </div>

          {/* Password */}
          <div className="input-group mb-4">
            <span className="input-group-text bg-success text-white">
              <FaLock />
            </span>
            <input
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="btn btn-success w-100 fw-bold d-flex align-items-center justify-content-center mb-3"
          >
            <FaUserPlus className="me-2" /> Sign Up
          </button>
          <div className="text-center">
            <span className="text-muted">Already have an account? </span>
            <button
              type="button"
              className="btn btn-link fw-semibold p-0"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
