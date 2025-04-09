import "../styles/ApplicationList.css";

const applications = [
  { id: 1, name: "Dolapo Johnson", status: "Pending" },
  { id: 2, name: "Fisayo Balogun", status: "Accepted" },
];
const ApplicationList = () => {
  return (
    <div className="application-list">
      {applications.map((app) => (
        <div key={app.id} className="application-card">
          <h3>{app.name}</h3>
          <p>Status: {app.status}</p>
        </div>
      ))}
    </div>
  );
};

export default ApplicationList;
