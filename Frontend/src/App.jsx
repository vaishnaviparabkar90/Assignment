import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import UsersList from "./UsersList";
import StoresList from "./StoresList";
import StoreDashboard from "./StoreDashboard"; 
import AdminsList from  "./AdminsList"; 
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/store-dashboard" element={<StoreDashboard />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/users-list" element={<UsersList />} />
        <Route path="/stores-list" element={<StoresList />}/>
        <Route path="/admin-list" element={<AdminsList/>} /> 
      </Routes>
    </Router>
  );
}

export default App;
