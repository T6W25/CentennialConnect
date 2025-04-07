import React, { useState } from "react";
import "../styles/ResumeUpload.css";

function ResumeUpload() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      alert(`Uploaded: ${file.name}`);
      setFile(null);
    } else {
      alert("Please select a file first.");
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Your Resume</h2>
      <input type="file" accept=".pdf,.docx" onChange={handleFileChange} />
      {file && <p>Selected File: {file.name}</p>}
      <button onClick={handleUpload} className="upload-btn">
        Upload
      </button>
    </div>
  );
}

export default ResumeUpload;
