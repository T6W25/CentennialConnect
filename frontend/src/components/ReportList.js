import React, { useState } from "react";
import "../styles/ReportList.css";

const ReportList = ({ reports }) => {
  const [resolvedReports, setResolvedReports] = useState([]);

  const markResolved = (index) => {
    setResolvedReports([...resolvedReports, index]);
  };

  return (
    <div className="reports-list">
      <h2>Reported Users</h2>
      <ul>
        {reports.map((report, index) => (
          <li
            key={index}
            className={resolvedReports.includes(index) ? "resolved" : ""}
          >
            <strong>{report.user}</strong> - {report.reason} ({report.details})
            {!resolvedReports.includes(index) && (
              <button
                onClick={() => markResolved(index)}
                className="resolve-btn"
              >
                Mark Resolved
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReportList;
