import React, { useState } from "react";
import "../styles/RSVPTracker.css";

function RSVPTracker() {
  const [name, setName] = useState("");
  const [attendees, setAttendees] = useState([]);

  const handleRSVP = (e) => {
    e.preventDefault();
    if (name.trim() === "") return;

    setAttendees([...attendees, name]);
    setName("");
  };

  return (
    <div className="rsvp-container">
      <h1>Event RSVP & Attendee Tracking</h1>

      <form onSubmit={handleRSVP} className="rsvp-form">
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">RSVP</button>
      </form>

      <div className="attendee-list">
        <h2>Confirmed Attendees ({attendees.length})</h2>
        <ul>
          {attendees.map((attendee, index) => (
            <li key={index}>{attendee}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default RSVPTracker;
