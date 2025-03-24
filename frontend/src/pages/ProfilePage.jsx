import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile, updateUserProfile, clearError, resetSuccess } from "../slices/authSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [bio, setBio] = useState("");
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  const dispatch = useDispatch();

  const { userInfo, userProfile, loading, error, success } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!userProfile) {
      dispatch(getUserProfile());
    } else {
      setName(userProfile.name);
      setEmail(userProfile.email);
      setProfilePicture(userProfile.profilePicture || "");
      setBio(userProfile.bio || "");
    }
  }, [dispatch, userProfile]);

  useEffect(() => {
    if (success) {
      setMessage("Profile updated successfully");
      setTimeout(() => {
        setMessage(null);
        dispatch(resetSuccess());
      }, 3000);
    }
  }, [success, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      dispatch(
        updateUserProfile({
          name,
          email,
          password: password ? password : undefined,
          profilePicture,
          bio,
        })
      );
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-6 text-green-600">Your Profile</h1>
        {message && <Message variant="success">{message}</Message>}
        {error && (
          <Message variant="error" onClose={() => dispatch(clearError())}>
            {error}
          </Message>
        )}
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="flex flex-col md:flex-row items-center mb-8">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4 md:mb-0 md:mr-6">
                {profilePicture ? (
                  <img
                    src={profilePicture || "/placeholder.svg"}
                    alt={name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-4xl text-gray-500">👤</span>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{userProfile?.name}</h2>
                <p className="text-gray-600">{userProfile?.email}</p>
                <span className="inline-block bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full mt-2">
                  {userProfile?.role}
                </span>
                <p className="mt-2 text-gray-700">{userProfile?.bio || "No bio yet"}</p>
              </div>
            </div>

            <div className="border-b border-gray-200 mb-6">
              <nav className="flex -mb-px">
                <button
                  className={`mr-8 py-4 text-sm font-medium ${
                    activeTab === "profile"
                      ? "border-b-2 border-green-500 text-green-600"
                      : "text-gray-500 hover:text-green-600"
                  }`}
                  onClick={() => setActiveTab("profile")}
                >
                  Edit Profile
                </button>
                <button
                  className={`mr-8 py-4 text-sm font-medium ${
                    activeTab === "connections"
                      ? "border-b-2 border-green-500 text-green-600"
                      : "text-gray-500 hover:text-green-600"
                  }`}
                  onClick={() => setActiveTab("connections")}
                >
                  Connections
                </button>
                <button
                  className={`mr-8 py-4 text-sm font-medium ${
                    activeTab === "events"
                      ? "border-b-2 border-green-500 text-green-600"
                      : "text-gray-500 hover:text-green-600"
                  }`}
                  onClick={() => setActiveTab("events")}
                >
                  Events
                </button>
                <button
                  className={`mr-8 py-4 text-sm font-medium ${
                    activeTab === "groups"
                      ? "border-b-2 border-green-500 text-green-600"
                      : "text-gray-500 hover:text-green-600"
                  }`}
                  onClick={() => setActiveTab("groups")}
                >
                  Groups
                </button>
              </nav>
            </div>

            {activeTab === "profile" && (
              <form onSubmit={submitHandler}>
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
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-100"
                    value={email}
                    disabled
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Picture URL
                  </label>
                  <input
                    type="text"
                    id="profilePicture"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={profilePicture}
                    onChange={(e) => setProfilePicture(e.target.value)}
                    placeholder="Enter image URL"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself"
                    rows="4"
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave blank to keep current password"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Leave blank to keep current password"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Update Profile
                </button>
              </form>
            )}

            {activeTab === "connections" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Your Connections</h2>
                {userProfile?.connections && userProfile.connections.length > 0 ? (
                  <div className="space-y-4">
                    {userProfile.connections.map((connection) => (
                      <div key={connection._id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                          {connection.profilePicture ? (
                            <img
                              src={connection.profilePicture || "/placeholder.svg"}
                              alt={connection.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-xl text-gray-500">👤</span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">{connection.name}</h3>
                          <p className="text-sm text-gray-600">{connection.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">You don't have any connections yet.</p>
                )}
              </div>
            )}

            {activeTab === "events" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Your Events</h2>
                {userProfile?.events && userProfile.events.length > 0 ? (
                  <div className="space-y-4">
                    {userProfile.events.map((event) => (
                      <div key={event._id} className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(event.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">You haven't registered for any events yet.</p>
                )}
              </div>
            )}

            {activeTab === "groups" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Your Groups</h2>
                {userProfile?.groups && userProfile.groups.length > 0 ? (
                  <div className="space-y-4">
                    {userProfile.groups.map((group) => (
                      <div key={group._id} className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold">{group.name}</h3>
                        <p className="text-sm text-gray-600">{group.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">You haven't joined any groups yet.</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;