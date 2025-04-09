import React, { useState } from "react";
import "../styles/JobApplicationForm.css";

const JobApplicationForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "", job: "" });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`Applied: ${formData.name} for ${formData.job}`);
  };

  return (
    <div className="application-container">
      <h2>Apply for a Job</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="job"
          placeholder="Job Position"
          onChange={handleChange}
          required
        />
        <button type="submit" className="apply-btn">
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default JobApplicationForm;
