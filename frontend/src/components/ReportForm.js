import { useState } from "react";
import "../styles/ReportForm.css";

const ReportForm = ({ onReportSubmit }) => {
  const [report, setReport] = useState({ user: "", reason: "", details: "" });

  const handleChange = (e) => {
    setReport({ ...report, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onReportSubmit(report);
    setReport({ user: "", reason: "", details: "" });
  };

  return (
    <div className="report-container">
      <h2>Report a User</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="user"
          placeholder="User Name"
          value={report.user}
          onChange={handleChange}
          required
        />
        <select
          name="reason"
          value={report.reason}
          onChange={handleChange}
          required
        >
          <option value="">Select Reason</option>
          <option value="Harassment">Harassment</option>
          <option value="Spam">Spam</option>
          <option value="Inappropriate Content">Inappropriate Content</option>
        </select>
        <textarea
          name="details"
          placeholder="Additional Details"
          value={report.details}
          onChange={handleChange}
        ></textarea>
        <button type="submit" className="report-btn">
          Submit Report
        </button>
      </form>
    </div>
  );
};

export default ReportForm;
