import React from "react";

const CardInfo = ({ title, value, color }) => {
  return (
    <div
      className={`card text-center shadow-lg border-2 mb-4`}
      style={{ width: "300px", borderRadius: "10px" }}
    >
      <div className={`card-body text-${color}`}>
        <h5 className="card-title">{title}</h5>
        <p className="card-text display-6 fw-bold">{value}</p>
      </div>
    </div>
  );
};

export default CardInfo;
