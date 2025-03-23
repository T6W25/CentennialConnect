"use client"
import '../styles/HomePage.css';
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getFeaturedEvents } from "../slices/eventSlice"
import { getFeaturedPosts } from "../slices/postSlice"
import Loader from "../components/Loader"
import Message from "../components/Message"
import EventCard from "../components/EventCard"
import PostCard from "../components/PostCard"

import { Link } from "react-router-dom"

const HomePage = () => {
  const dispatch = useDispatch()

  const { userInfo } = useSelector((state) => state.auth)
  const { featuredEvents, loading: eventsLoading, error: eventsError } = useSelector((state) => state.events)
  const { featuredPosts, loading: postsLoading, error: postsError } = useSelector((state) => state.posts)
 

  useEffect(() => {
    if (userInfo) {
      dispatch(getFeaturedEvents())
      dispatch(getFeaturedPosts())
      dispatch(getNotifications())
    }
  }, [dispatch, userInfo])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-green-600">Featured Events</h2>
              <Link to="/events" className="text-green-600 hover:underline text-sm font-medium">
                View All
              </Link>
            </div>
            {eventsLoading ? (
              <Loader />
            ) : eventsError ? (
              <Message variant="error">{eventsError}</Message>
            ) : featuredEvents.length === 0 ? (
              <p className="text-gray-500">No featured events at the moment.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredEvents.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-green-600">Featured Discussions</h2>
              <Link to="/discussions" className="text-green-600 hover:underline text-sm font-medium">
                View All
              </Link>
            </div>
            {postsLoading ? (
              <Loader />
            ) : postsError ? (
              <Message variant="error">{postsError}</Message>
            ) : featuredPosts.length === 0 ? (
              <p className="text-gray-500">No featured discussions at the moment.</p>
            ) : (
              <div className="space-y-4">
                {featuredPosts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h3 className="text-xl font-bold mb-4 text-green-600">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/communities" className="text-gray-700 hover:text-green-600 flex items-center">
                 </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-700 hover:text-green-600 flex items-center">
                  <span className="mr-2">📅</span> Events
                </Link>
              </li>
              <li>
                <Link to="/discussions" className="text-gray-700 hover:text-green-600 flex items-center">
                  <span className="mr-2">💬</span> Discussions
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-700 hover:text-green-600 flex items-center">
                  <span className="mr-2">🔍</span> Search
                </Link>
              </li>
              {userInfo && userInfo.role === "admin" && (
                <li>
                  <Link to="/admin" className="text-gray-700 hover:text-green-600 flex items-center">
                    <span className="mr-2">⚙️</span> Admin Panel
                  </Link>
                </li>
              )}
              
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage

