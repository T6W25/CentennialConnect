import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllEvents, clearError } from "../slices/eventSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import EventCard from "../components/EventCard";
import '../styles/EventsPage.css';

const EventsPage = () => {
  const [filter, setFilter] = useState("all");
  const [filteredEvents, setFilteredEvents] = useState([]);

  const dispatch = useDispatch();

  const { events, loading, error } = useSelector((state) => state.events);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

  useEffect(() => {
    if (events) {
      if (filter === "all") {
        setFilteredEvents(events);
      } else if (filter === "upcoming") {
        setFilteredEvents(
          events.filter((event) => new Date(event.date) > new Date())
        );
      } else if (filter === "past") {
        setFilteredEvents(
          events.filter((event) => new Date(event.date) < new Date())
        );
      } else if (filter === "registered") {
        setFilteredEvents(
          events.filter((event) =>
            event.attendees.some((attendee) => attendee === userInfo._id)
          )
        );
      }
    }
  }, [events, filter, userInfo]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-green-600 mb-4 md:mb-0">Events</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          {userInfo && (userInfo.role === "eventManager" || userInfo.role === "admin") && (
            <Link
              to="/event-manager"
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center"
            >
              <span className="mr-2">+</span> Create Event
            </Link>
          )}
          <div className="flex items-center">
            <label htmlFor="filter" className="mr-2 text-gray-700">
              Filter:
            </label>
            <select
              id="filter"
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Events</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
              <option value="registered">Registered</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error" onClose={() => dispatch(clearError())}>
          {error}
        </Message>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📅</div>
          <h2 className="text-2xl font-semibold mb-2">No events found</h2>
          <p className="text-gray-600 mb-6">There are no events matching your filter criteria.</p>
          {userInfo && (userInfo.role === "eventManager" || userInfo.role === "admin") && (
            <Link
              to="/event-manager"
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 inline-flex items-center"
            >
              <span className="mr-2">+</span> Create Event
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsPage;