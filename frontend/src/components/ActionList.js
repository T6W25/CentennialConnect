import { useState } from "react";
import "../styles/ActionList.css";

const ActionsList = () => {
  const [actions, setActions] = useState([
    { id: 1, user: "Jonas smith", type: "Warning", reason: "Misconduct" },
    {
      id: 2,
      user: "Alex Fish",
      type: "Suspension",
      reason: "Repeated offenses",
      duration: "7 days",
    },
  ]);

  return (
    <div className="actions-container">
      <h2>Warnings & Suspensions</h2>
      <ul>
        {actions.map((action) => (
          <li key={action.id}>
            <strong>{action.user}</strong> - {action.type} ({action.reason}){" "}
            {action.duration && `for ${action.duration}`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActionsList;
