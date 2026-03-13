import React from "react";

const Spinner = ({ message = "Loading..." }) => (
  <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3" style={{ minHeight: 300 }}>
    <div className="spinner-border" role="status" style={{ color: "#6c63ff", width: 48, height: 48 }}>
      <span className="visually-hidden">Loading...</span>
    </div>
    <p className="mb-0 small" style={{ color: "#666688" }}>{message}</p>
  </div>
);

export default Spinner;
