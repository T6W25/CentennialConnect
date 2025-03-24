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

  const { event, loading, error, success } = useSelector((state) => state.events);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getEventById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (success) {
      dispatch(resetSuccess());
      dispatch(getEventById(id));
    }
  }, [success, dispatch, id]);

  const isRegistered = event?.attendees.some(
    (attendee) => attendee._id === userInfo._id
  );

  const isCreator = event?.creator._id === userInfo._id;

  const isEventManager =
    userInfo.role === "eventManager" || userInfo.role === "admin";

  const handleRegister = () => {
    dispatch(registerForEvent(id));
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
                <div>
                  {!isRegistered ? (
                    <button
                      onClick={handleRegister}
                      className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      disabled={
                        event.maxAttendees > 0 &&
                        event.attendees.length >= event.maxAttendees
                      }
                    >
                      {event.maxAttendees > 0 &&
                      event.attendees.length >= event.maxAttendees
                        ? "Event Full"
                        : "Register for Event"}
                    </button>
                  ) : (
                    <button
                      className="bg-gray-400 text-white py-2 px-6 rounded-md cursor-not-allowed"
                      disabled
                    >
                      Already Registered
                    </button>
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
                  {event.attendees.length > 10 && (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-sm font-semibold">
                      +{event.attendees.length - 10}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-600">No attendees yet</p>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Announcements</h2>
              {event.announcements && event.announcements.length > 0 ? (
                <div className="space-y-4 mb-6">
                  {event.announcements.map((announcement, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-md">
                      <p className="text-gray-700 mb-1">{announcement.message}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(announcement.date)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 mb-6">No announcements yet</p>
              )}

              {(isCreator || isEventManager) && (
                <form onSubmit={handleSendAnnouncement}>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mb-3"
                    value={announcementMessage}
                    onChange={(e) => setAnnouncementMessage(e.target.value)}
                    placeholder="Write an announcement..."
                    rows="3"
                    required
                  ></textarea>
                  <button
                    type="submit"
                    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Send Announcement
                  </button>
                </form>
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