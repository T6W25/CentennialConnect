import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCommunities, clearError } from "../slices/communitySlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import '../styles/CommunitiesPage.css';

const CommunitiesPage = () => {
  const dispatch = useDispatch();

  const { communities, loading, error } = useSelector((state) => state.communities);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getCommunities());
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-green-600 mb-4 md:mb-0">Communities</h1>
        {userInfo && (userInfo.role === "communityManager" || userInfo.role === "admin") && (
          <Link
            to="/community-manager"
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center"
          >
            <span className="mr-2">+</span> Create Community
          </Link>
        )}
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error" onClose={() => dispatch(clearError())}>
          {error}
        </Message>
      ) : communities.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏢</div>
          <h2 className="text-2xl font-semibold mb-2">No communities found</h2>
          <p className="text-gray-600 mb-6">There are no communities available yet.</p>
          {userInfo && (userInfo.role === "communityManager" || userInfo.role === "admin") && (
            <Link
              to="/community-manager"
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 inline-flex items-center"
            >
              <span className="mr-2">+</span> Create Community
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((community) => (
            <div key={community._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-40 bg-gray-200">
                {community.image ? (
                  <img
                    src={community.image || "/placeholder.svg"}
                    alt={community.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-green-100 text-green-600">
                    <span className="text-6xl">🏢</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{community.name}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{community.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {community.members?.length || 0} members
                  </span>
                  <Link
                    to={`/communities/${community._id}`}
                    className="text-green-600 hover:underline"
                  >
                    View Community
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunitiesPage;