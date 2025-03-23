import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCommunities, createCommunity, clearError, resetSuccess } from "../slices/communitySlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import '../styles/CommunityManagerPage.css';

const CommunityManagerPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [showForm, setShowForm] = useState(false);

  const dispatch = useDispatch();

  const { communities, loading, error, success } = useSelector((state) => state.communities);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getCommunities());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setName("");
      setDescription("");
      setImage("");
      setShowForm(false);
      dispatch(resetSuccess());
    }
  }, [success, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      createCommunity({
        name,
        description,
        image,
      })
    );
  };

  // Filter communities where the user is a manager or creator
  const managedCommunities = communities.filter(
    (community) =>
      community.creator === userInfo._id ||
      community.managers?.includes(userInfo._id) ||
      userInfo.role === "admin"
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-green-600 mb-4 md:mb-0">Community Manager</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center"
        >
          <span className="mr-2">{showForm ? "-" : "+"}</span>
          {showForm ? "Cancel" : "Create Community"}
        </button>
      </div>

      {error && (
        <Message variant="error" onClose={() => dispatch(clearError())}>
          {error}
        </Message>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Create a New Community</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="mb-6">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL (optional)
              </label>
              <input
                type="text"
                id="image"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Enter image URL"
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Create Community
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-6">Your Communities</h2>
        {loading ? (
          <Loader />
        ) : managedCommunities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">You don't manage any communities yet.</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-green-600 hover:underline"
            >
              Create your first community
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {managedCommunities.map((community) => (
              <div key={community._id} className="bg-gray-50 rounded-lg overflow-hidden">
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
                  <div className="flex justify-between">
                    <Link
                      to={`/communities/${community._id}`}
                      className="text-green-600 hover:underline text-sm"
                    >
                      View
                    </Link>
                    <span className="text-sm text-gray-500">
                      {community.members?.length || 0} members
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityManagerPage;