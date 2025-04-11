import React, { useState } from "react";
import "../styles/WarningForm.css";

const WarningForm = () => {
  const [warning, setWarning] = useState({ user: "", reason: "" });

  const handleChange = (e) => {
    setWarning({ ...warning, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Warning issued to ${warning.user} for: ${warning.reason}`);
  };

  return (
    <div className="warning-container">
      <h2>Issue a Warning</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="user"
          placeholder="User Name"
          onChange={handleChange}
          required
        />
        <textarea
          name="reason"
          placeholder="Reason for Warning"
          onChange={handleChange}
          required
        ></textarea>
        <button type="submit" className="warn-btn">
          Issue Warning
        </button>
      </form>
    </div>
  );
};

export default WarningForm;
