import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { searchAll, clearResults, clearError } from "../slices/searchSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { formatDate } from "../utils/formatDate";
import '../styles/SearchPage.css';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const dispatch = useDispatch();

  const { results, loading, error } = useSelector((state) => state.search);

  useEffect(() => {
    return () => {
      dispatch(clearResults());
    };
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      dispatch(searchAll(searchTerm));
    }
  };

  const hasResults =
    results.users?.length > 0 ||
    results.communities?.length > 0 ||
    results.groups?.length > 0 ||
    results.events?.length > 0 ||
    results.posts?.length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-600 mb-6">Search</h1>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex">
          <input
            type="text"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Search for users, communities, groups, events, or posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-r-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Search
          </button>
        </div>
      </form>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error" onClose={() => dispatch(clearError())}>
          {error}
        </Message>
      ) : hasResults ? (
        <>
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  className={`mr-8 py-4 text-sm font-medium ${
                    activeTab === "all"
                      ? "border-b-2 border-green-500 text-green-600"
                      : "text-gray-500 hover:text-green-600"
                  }`}
                  onClick={() => setActiveTab("all")}
                >
                  All Results
                </button>
                {results.users?.length > 0 && (
                  <button
                    className={`mr-8 py-4 text-sm font-medium ${
                      activeTab === "users"
                        ? "border-b-2 border-green-500 text-green-600"
                        : "text-gray-500 hover:text-green-600"
                    }`}
                    onClick={() => setActiveTab("users")}
                  >
                    Users ({results.users.length})
                  </button>
                )}
                {results.communities?.length > 0 && (
                  <button
                    className={`mr-8 py-4 text-sm font-medium ${
                      activeTab === "communities"
                        ? "border-b-2 border-green-500 text-green-600"
                        : "text-gray-500 hover:text-green-600"
                    }`}
                    onClick={() => setActiveTab("communities")}
                  >
                    Communities ({results.communities.length})
                  </button>
                )}
                {results.groups?.length > 0 && (
                  <button
                    className={`mr-8 py-4 text-sm font-medium ${
                      activeTab === "groups"
                        ? "border-b-2 border-green-500 text-green-600"
                        : "text-gray-500 hover:text-green-600"
                    }`}
                    onClick={() => setActiveTab("groups")}
                  >
                    Groups ({results.groups.length})
                  </button>
                )}
                {results.events?.length > 0 && (
                  <button
                    className={`mr-8 py-4 text-sm font-medium ${
                      activeTab === "events"
                        ? "border-b-2 border-green-500 text-green-600"
                        : "text-gray-500 hover:text-green-600"
                    }`}
                    onClick={() => setActiveTab("events")}
                  >
                    Events ({results.events.length})
                  </button>
                )}
                {results.posts?.length > 0 && (
                  <button
                    className={`mr-8 py-4 text-sm font-medium ${
                      activeTab === "posts"
                        ? "border-b-2 border-green-500 text-green-600"
                        : "text-gray-500 hover:text-green-600"
                    }`}
                    onClick={() => setActiveTab("posts")}
                  >
                    Posts ({results.posts.length})
                  </button>
                )}
              </nav>
            </div>
          </div>

          {(activeTab === "all" || activeTab === "users") && results.users?.length > 0 && (
            <div className="mb-8">
              {activeTab === "all" && <h2 className="text-xl font-bold mb-4">Users</h2>}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.users.slice(0, activeTab === "all" ? 3 : undefined).map((user) => (
                  <div key={user._id} className="bg-white rounded-lg shadow-md p-4 flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                      {user.profilePicture ? (
                        <img
                          src={user.profilePicture || "/placeholder.svg"}
                          alt={user.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-500">👤</span>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                      <div className="text-xs text-gray-500 mt-1">{user.role}</div>
                    </div>
                  </div>
                ))}
              </div>
              {activeTab === "all" && results.users.length > 3 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setActiveTab("users")}
                    className="text-green-600 hover:underline"
                  >
                    View all {results.users.length} users
                  </button>
                </div>
              )}
            </div>
          )}

          {(activeTab === "all" || activeTab === "communities") && results.communities?.length > 0 && (
            <div className="mb-8">
              {activeTab === "all" && <h2 className="text-xl font-bold mb-4">Communities</h2>}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.communities.slice(0, activeTab === "all" ? 3 : undefined).map((community) => (
                  <div key={community._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="h-32 bg-gray-200">
                      {community.image ? (
                        <img
                          src={community.image || "/placeholder.svg"}
                          alt={community.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-green-100 text-green-600">
                          <span className="text-4xl">🏢</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">{community.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {community.description}
                      </p>
                      <Link
                        to={`/communities/${community._id}`}
                        className="text-green-600 hover:underline text-sm"
                      >
                        View Community
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              {activeTab === "all" && results.communities.length > 3 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setActiveTab("communities")}
                    className="text-green-600 hover:underline"
                  >
                    View all {results.communities.length} communities
                  </button>
                </div>
              )}
            </div>
          )}

          {(activeTab === "all" || activeTab === "groups") && results.groups?.length > 0 && (
            <div className="mb-8">
              {activeTab === "all" && <h2 className="text-xl font-bold mb-4">Groups</h2>}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.groups.slice(0, activeTab === "all" ? 3 : undefined).map((group) => (
                  <div key={group._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="h-32 bg-gray-200">
                      {group.image ? (
                        <img
                          src={group.image || "/placeholder.svg"}
                          alt={group.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-green-100 text-green-600">
                          <span className="text-4xl">👨‍👩‍👧‍👦</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">{group.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {group.description}
                      </p>
                      <Link
                        to={`/groups/${group._id}`}
                        className="text-green-600 hover:underline text-sm"
                      >
                        View Group
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              {activeTab === "all" && results.groups.length > 3 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setActiveTab("groups")}
                    className="text-green-600 hover:underline"
                  >
                    View all {results.groups.length} groups
                  </button>
                </div>
              )}
            </div>
          )}

          {(activeTab === "all" || activeTab === "events") && results.events?.length > 0 && (
            <div className="mb-8">
              {activeTab === "all" && <h2 className="text-xl font-bold mb-4">Events</h2>}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.events.slice(0, activeTab === "all" ? 3 : undefined).map((event) => (
                  <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="h-32 bg-gray-200">
                      {event.image ? (
                        <img
                          src={event.image || "/placeholder.svg"}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-green-100 text-green-600">
                          <span className="text-4xl">📅</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">{event.title}</h3>
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
                      <Link
                        to={`/events/${event._id}`}
                        className="text-green-600 hover:underline text-sm"
                      >
                        View Event
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              {activeTab === "all" && results.events.length > 3 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setActiveTab("events")}
                    className="text-green-600 hover:underline"
                  >
                    View all {results.events.length} events
                  </button>
                </div>
              )}
            </div>
          )}

          {(activeTab === "all" || activeTab === "posts") && results.posts?.length > 0 && (
            <div className="mb-8">
              {activeTab === "all" && <h2 className="text-xl font-bold mb-4">Posts</h2>}
              <div className="space-y-4">
                {results.posts.slice(0, activeTab === "all" ? 3 : undefined).map((post) => (
                  <div key={post._id} className="bg-white rounded-lg shadow-md p-4">
                    <h3 className="font-semibold mb-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.content}</p>
                    <Link
                      to={`/posts/${post._id}`}
                      className="text-green-600 hover:underline text-sm"
                    >
                      Read More
                    </Link>
                  </div>
                ))}
              </div>
              {activeTab === "all" && results.posts.length > 3 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setActiveTab("posts")}
                    className="text-green-600 hover:underline"
                  >
                    View all {results.posts.length} posts
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      ) : searchTerm ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-semibold mb-2">No results found</h2>
          <p className="text-gray-600">
            We couldn't find any matches for "{searchTerm}". Please try another search.
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default SearchPage;