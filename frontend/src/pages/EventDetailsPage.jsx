import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getEventById,
  registerForEvent,
  sendEventAnnouncement,
  clearError,
  resetSuccess,
} from "../slices/eventSlice";
import { formatDate, formatTime } from "../utils/formatDate";

const EventDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [announcementMessage, setAnnouncementMessage] = useState("");

  const { event, loading, error } = useSelector((state) => state.events);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getEventById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => dispatch(clearError()), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const isRegistered = event?.attendees.some(
    (attendee) => attendee._id === userInfo._id
  );

  const isCreator = event?.creator._id === userInfo._id;
  const isEventManager = ["eventManager", "admin"].includes(userInfo?.role);

  const handleRegister = () => dispatch(registerForEvent(id));

  const handleSendAnnouncement = (e) => {
    e.preventDefault();
    if (announcementMessage.trim()) {
      dispatch(sendEventAnnouncement({ id, message: announcementMessage }));
      setAnnouncementMessage("");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/events" className="text-green-600 hover:underline">
          ← Back to Events
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className="p-3 mb-4 bg-red-100 text-red-700 rounded">
          {error}
          <button 
            onClick={() => dispatch(clearError())}
            className="ml-2 text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      ) : event ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Event Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-64 bg-gray-200">
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-6">
                <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center">
                    📅 {formatDate(event.date)}
                  </div>
                  <div className="flex items-center">
                    🕒 {formatTime(event.date)}
                  </div>
                  <div className="flex items-center">
                    📍 {event.location}
                  </div>
                </div>
                <div className="mb-6">
                  <span className="bg-green-100 text-green-600 text-sm px-3 py-1 rounded-full">
                    {event.category}
                  </span>
                </div>
                <p className="whitespace-pre-line mb-8">{event.description}</p>
                <button
                  onClick={handleRegister}
                  className={`py-2 px-6 rounded-md ${
                    isRegistered || (event.maxAttendees > 0 && 
                    event.attendees.length >= event.maxAttendees)
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                  disabled={isRegistered || (event.maxAttendees > 0 && 
                    event.attendees.length >= event.maxAttendees)}
                >
                  {isRegistered
                    ? "Already Registered"
                    : event.maxAttendees > 0 &&
                      event.attendees.length >= event.maxAttendees
                    ? "Event Full"
                    : "Register for Event"}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Organizer</h2>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-200 mr-4">
                  {event.creator.profilePicture ? (
                    <img 
                      src={event.creator.profilePicture} 
                      alt={event.creator.name}
                      className="rounded-full"
                    />
                  ) : (
                    <span className="flex items-center justify-center h-full">👤</span>
                  )}
                </div>
                <div>
                  <p className="font-semibold">{event.creator.name}</p>
                  <p className="text-sm text-gray-600">{event.creator.role}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">
                Attendees ({event.attendees.length}
                {event.maxAttendees > 0 ? `/${event.maxAttendees}` : ""})
              </h2>
              <div className="flex flex-wrap gap-2">
                {event.attendees.slice(0, 10).map((attendee) => (
                  <div
                    key={attendee._id}
                    className="w-10 h-10 rounded-full bg-gray-200"
                    title={attendee.name}
                  >
                    {attendee.profilePicture ? (
                      <img
                        src={attendee.profilePicture}
                        alt={attendee.name}
                        className="rounded-full"
                      />
                    ) : (
                      <span className="flex items-center justify-center h-full">👤</span>
                    )}
                  </div>
                ))}
                {event.attendees.length > 10 && (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                    +{event.attendees.length - 10}
                  </div>
                )}
              </div>
            </div>

            {(isCreator || isEventManager) && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Announcements</h2>
                {event.announcements?.length > 0 ? (
                  <div className="space-y-4 mb-6">
                    {event.announcements.map((announcement, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-md">
                        <p>{announcement.message}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(announcement.date)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mb-6">No announcements yet</p>
                )}

                <form onSubmit={handleSendAnnouncement}>
                  <textarea
                    className="w-full p-2 border rounded-md mb-3"
                    value={announcementMessage}
                    onChange={(e) => setAnnouncementMessage(e.target.value)}
                    placeholder="Write an announcement..."
                    rows="3"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                  >
                    Send Announcement
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>Event not found</p>
      )}
    </div>
  );
};

export default EventDetailsPage;