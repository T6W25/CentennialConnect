import '../styles/EventCard.css';
import { Link } from "react-router-dom"
import { formatDate } from "../utils/formatDate"

const EventCard = ({ event }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-40 bg-gray-200~">
        {event.image ? (
          <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-green-100 text-green-600">
            <span className="text-4xl">📅</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">{event.title}</h3>
        <div className="text-sm text-gray-600 mb-2">
          <div className="flex items-center mb-1">
            <span className="mr-1">📅</span>
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">📍</span>
            <span>{event.location}</span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">{event.category}</span>
          <Link to={`/events/${event._id}`} className="text-green-600 hover:underline text-sm font-medium">
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EventCard

