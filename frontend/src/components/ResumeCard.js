import React from "react";
import "../styles/ResumeCard.css";

function ResumeCard({ name, position }) {
  return (
    <div className="resume-card">
      <h3>{name}</h3>
      <p>{position}</p>
      <button className="view-btn">View Resume</button>
    </div>
  );
}

export default ResumeCard;
