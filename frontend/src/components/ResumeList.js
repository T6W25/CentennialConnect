import ResumeCard from "./ResumeCard";
import "../styles/ResumeList.css";
const resumes = [
  { id: 1, name: "Jonas Smith", position: "Frontend Developer" },
  { id: 2, name: "Alex Fish", position: "UI/UX Designer" },
];

const ResumeList = () => {
  return (
    <div className="resume-list">
      {resumes.map((resume) => (
        <ResumeCard
          key={resume.id}
          name={resume.name}
          position={resume.position}
        />
      ))}
    </div>
  );
};

export default ResumeList;
