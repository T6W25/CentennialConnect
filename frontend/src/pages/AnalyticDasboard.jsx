import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import "../styles/AnalyticsDashboard.css";

Chart.register(...registerables);

function AnalyticsDashboard() {
  const [data] = useState([
    { date: "2025-03-25", activity: 30 },
    { date: "2025-03-26", activity: 45 },
    { date: "2025-03-27", activity: 50 },
    { date: "2025-03-28", activity: 70 },
  ]);

  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        label: "User Activity",
        data: data.map((d) => d.activity),
        borderColor: "#BCD62B",
        backgroundColor: "rgba(188, 214, 43, 0.2)",
        fill: true,
      },
    ],
  };

  return (
    <div className="dashboard">
      <h1>User Analytics Dashboard</h1>

      <div className="metrics-container">
        <div className="metric-card">
          <h3>Total Users</h3>
          <p>500</p>
        </div>
        <div className="metric-card">
          <h3>Active Users</h3>
          <p>120</p>
        </div>
        <div className="metric-card">
          <h3>Engagement Rate</h3>
          <p>24%</p>
        </div>
      </div>

      <div className="chart-container">
        <h3>User Activity Over Time</h3>
        <Line data={chartData} />
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
