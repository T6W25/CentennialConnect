import React from "react";

import "../styles/ResumeUploads.css";
import ResumeUpload from "../components/ResumeUpload";
import JobApplicationForm from "../components/ApplicationJobForm";

const ResumeUploadPage = () => {
  return (
    <div className="home-container">
      <h1>Resume & Job Application Portal</h1>
      <ResumeUpload />
      <JobApplicationForm />
    </div>
  );
};

export default ResumeUploadPage;
