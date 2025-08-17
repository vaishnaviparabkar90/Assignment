import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import CardInfo from "./CardInfo";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });

  useEffect(() => {
    fetch("http://localhost:5000/admin/dashboard")
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar />
      <div className="flex-grow-1 p-4">
        <h2 className="mb-4 text-center">Dashboard</h2>
        <div className="d-flex gap-4 flex-wrap justify-content-center">
          <CardInfo title="Total Users" value={stats.totalUsers} color="primary" />
          <CardInfo title="Total Stores" value={stats.totalStores} color="success" />
          <CardInfo title="Total Ratings" value={stats.totalRatings} color="warning" />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
