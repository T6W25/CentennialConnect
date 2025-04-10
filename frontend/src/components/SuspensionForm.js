import { useState } from "react";
import "../styles/SuspensionForm.css";

const SuspensionForm = () => {
  const [suspension, setSuspension] = useState({
    user: "",
    reason: "",
    duration: "",
  });

  const handleChange = (e) => {
    setSuspension({ ...suspension, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      `Suspended ${suspension.user} for ${suspension.duration} days: ${suspension.reason}`
    );
  };

  return (
    <div className="suspension-container">
      <h2>Issue a Suspension</h2>
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
          placeholder="Reason for Suspension"
          onChange={handleChange}
          required
        ></textarea>
        <input
          type="number"
          name="duration"
          placeholder="Duration (days)"
          onChange={handleChange}
          required
        />
        <button type="submit" className="suspend-btn">
          Suspend User
        </button>
      </form>
    </div>
  );
};

export default SuspensionForm;
