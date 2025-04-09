import ApplicationList from "../components/ApplicationList";
import ResumeList from "../components/ResumeList";
import "../styles/ResumeApplication.css";

const ResumeApplicationPage = () => {
  return (
    <div className="home-container">
      <h1>Resume & Application Viewer</h1>
      <div className="section">
        <h2>Resumes</h2>
        <ResumeList />
      </div>
      <div className="section">
        <h2>Applications</h2>
        <ApplicationList />
      </div>
    </div>
  );
};

export default ResumeApplicationPage;
