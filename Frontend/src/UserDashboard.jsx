import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
 
  const navigate = useNavigate();

  const userEmail = localStorage.getItem("userEmail"); 
  const [stores, setStores] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [localRatings, setLocalRatings] = useState({}); 

  const fetchStores = async () => {
    if (!userEmail) {
      alert("Please log in again. No userId found.");
      return;
    }
    try {
    const res = await fetch(`http://localhost:5000/user/stores?userEmail=${userEmail}`);
      const data = await res.json();
      setStores(data.stores || []);
      setFiltered(data.stores || []);
      
      const seed = {};
      (data.stores || []).forEach(s => {
        if (s.user_rating) seed[s.id] = s.user_rating;
      });
      setLocalRatings(seed);
    } catch (err) {
      console.error(err);
      alert("Failed to load stores");
    }
  };

  useEffect(() => { fetchStores(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      stores.filter(
        s =>
          s.name.toLowerCase().includes(q) ||
          (s.address || "").toLowerCase().includes(q)
      )
    );
  }, [search, stores]);

  const handleSelect = (storeId, value) => {
    setLocalRatings(prev => ({ ...prev, [storeId]: value ? Number(value) : "" }));
  };

 const saveRating = async (storeId) => {
  if (!userEmail) return alert("No userEmail. Please log in.");
  const rating = Number(localRatings[storeId]);
  if (!rating || rating < 1 || rating > 5) {
    return alert("Please choose a rating between 1 and 5.");
  }
  try {
    const res = await fetch("http://localhost:5000/user/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userEmail, storeId, rating }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed");
    alert("Rating saved!");
    fetchStores(); 
  } catch (err) {
    console.error(err);
    alert(`Could not save rating: ${err.message}`);
  }
};


  return (
    <div className="container py-4">
  <h2 className="mb-3 text-center mb-4 ">Browse Stores</h2>

  <input
    type="text"
    className="form-control mb-4"
    placeholder="Search by Name or Address…"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  <div className="row g-3">
    {filtered.map((s) => (
      <div className="col-md-4" key={s.id}>
        <div className="card shadow-lg h-100 border-2 rounded-3">
          <div className="card-body d-flex flex-column">
            <h5 className="card-title fw-bold">{s.name}</h5>
            <p className="text-muted mb-1">
               {s.address || "No Address"}
            </p>
            <p className="mb-2">
              ⭐ <strong>{s.overall_rating ?? 0}</strong> / 5
            </p>

            <div className="mt-auto">
              
<div className="mb-2">
  {[1, 2, 3, 4, 5].map((n) => (
    <span
      key={n}
      onClick={() => handleSelect(s.id, n)}
      style={{
        cursor: "pointer",
        fontSize: "1.8rem",
        color:
          (localRatings[s.id] !== undefined
            ? localRatings[s.id]
            : s.user_rating) >= n
            ? "#f5c518" // yellow for selected
            : "#e4e5e9" // grey for unselected
      }}
    >
      ★
    </span>
  ))}
</div>


              <button
                className="btn btn-success w-100"
                onClick={() => saveRating(s.id)}
              >
                Save Rating
              </button>
            </div>
          </div>
        </div>
      </div>
    ))}
    {/* Button for logout */}
    <div className="col-12 text-center mt-4">
      <button
        className="btn btn-secondary"
        onClick={() => {
           localStorage.removeItem("isLoggedIn");
localStorage.removeItem("userEmail");
localStorage.removeItem("userRole");
    navigate("/login");
        }}
      >
        Logout
      </button>
      </div>
    {filtered.length === 0 && (
      <div className="col-12">
        <div className="text-center py-5 text-muted">
          No stores found.
        </div>
      </div>
    )}
  </div>
</div>      
  );
};

export default UserDashboard;
