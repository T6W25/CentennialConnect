import '../styles/EventDetailsPage.css';
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
import Loader from "../components/Loader";
import Message from "../components/Message";
import { formatDate, formatTime } from "../utils/formatDate";

const EventDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [announcementMessage, setAnnouncementMessage] = useState("");
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { event, loading, error, success } = useSelector((state) => state.events);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getEventById(id));
  }, [dispatch, id, success]); // ✅ Auto-update attendee list after registering

  useEffect(() => {
    if (success) {
      dispatch(resetSuccess());
      setSuccessMessage("Successfully registered for the event!"); // ✅ Show confirmation message
      setTimeout(() => setSuccessMessage(""), 3000); // ✅ Hide after 3 sec
    }
  }, [success, dispatch]);

  const isRegistered = event?.attendees.some(
    (attendee) => attendee._id === userInfo._id
  );

  const isCreator = event?.creator._id === userInfo._id;
  const isEventManager = userInfo.role === "eventManager" || userInfo.role === "admin";

  const handleRegister = async () => {
    setLoadingRegister(true);
    await dispatch(registerForEvent(id));
    setLoadingRegister(false);
  };

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
        <Link to="/events" className="text-green-600 hover:underline flex items-center">
          <span className="mr-2">←</span> Back to Events
        </Link>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error" onClose={() => dispatch(clearError())}>
          {error}
        </Message>
      ) : event ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-64 bg-gray-200">
                {event.image ? (
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-green-100 text-green-600">
                    <span className="text-6xl">📅</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h1 className="text-3xl font-bold mb-4 text-gray-800">{event.title}</h1>
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">📅</span>
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">🕒</span>
                    <span>{formatTime(event.date)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">📍</span>
                    <span>{event.location}</span>
                  </div>
                </div>
                <div className="mb-6">
                  <span className="bg-green-100 text-green-600 text-sm px-3 py-1 rounded-full">
                    {event.category}
                  </span>
                </div>
                <div className="text-gray-700 mb-8 whitespace-pre-line">{event.description}</div>
                
                {successMessage && <Message variant="success">{successMessage}</Message>}

                <div>
                  {!isRegistered ? (
                    <button
                      onClick={handleRegister}
                      className={`py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        loadingRegister
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      }`}
                      disabled={loadingRegister || (event.maxAttendees > 0 && event.attendees.length >= event.maxAttendees)}
                    >
                      {loadingRegister ? "Registering..." : event.maxAttendees > 0 &&
                      event.attendees.length >= event.maxAttendees
                        ? "Event Full"
                        : "Register for Event"}
                    </button>
                  ) : (
                    <Message variant="success">You have successfully joined this event!</Message>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Organizer</h2>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  {event.creator.profilePicture ? (
                    <img
                      src={event.creator.profilePicture || "/placeholder.svg"}
                      alt={event.creator.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500">👤</span>
                  )}
                </div>
                <div>
                  <div className="font-semibold">{event.creator.name}</div>
                  <div className="text-sm text-gray-600">{event.creator.role}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Attendees ({event.attendees.length}
                {event.maxAttendees > 0 ? ` / ${event.maxAttendees}` : ""})
              </h2>
              {event.attendees.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {event.attendees.slice(0, 10).map((attendee) => (
                    <div
                      key={attendee._id}
                      className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center"
                      title={attendee.name}
                    >
                      {attendee.profilePicture ? (
                        <img
                          src={attendee.profilePicture || "/placeholder.svg"}
                          alt={attendee.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-500">👤</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No attendees yet</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <Message variant="error">Event not found</Message>
      )}
    </div>
  );
};

export default EventDetailsPage;
