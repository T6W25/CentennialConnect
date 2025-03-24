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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const dispatch = useDispatch();
  const { userProfile, loading, error, success } = useSelector((state) => state.auth);
  
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
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex justify-center bg-gray-50 py-4">
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 w-full mx-4 my-8" style={{ maxWidth: "600px" }}>
        {/* Logo and Header */}
        <div className="flex items-center mb-6">
          <div className="h-8 w-8 mr-3">
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 3.6C17.0609 3.6 16.1282 3.90714 15.3333 4.47771C14.5384 5.04828 13.9193 5.85362 13.5605 6.7868C13.2018 7.71997 13.1191 8.73942 13.324 9.72586C13.5289 10.7123 14.0113 11.6163 14.7087 12.3137C15.4062 13.0112 16.3102 13.4935 17.2966 13.6984C18.283 13.9033 19.3025 13.8207 20.2357 13.4619C21.1688 13.1032 21.9742 12.4841 22.5448 11.6891C23.1153 10.8942 23.4225 9.96148 23.4225 9.0225C23.4225 7.74533 22.9135 6.52091 22.0088 5.61618C21.1041 4.71146 19.8796 4.2025 18.6025 4.2025M18 3.6V4.2025V3.6ZM18 3.6C14.4525 3.6 10.9199 4.4829 7.79978 6.14816C4.67962 7.81342 2.09066 10.2015 0.26648 13.101C-1.5577 15.9005 -1.54498 19.0495 0.297867 21.8384C2.14071 24.6274 4.74522 26.9994 7.875 28.6494C11.0048 30.2993 14.5425 31.1645 18.09 31.1458C21.6375 31.1271 25.1652 30.2254 28.2752 28.5432C31.3853 26.861 33.9614 24.4635 35.7726 21.5617C37.5837 18.6599 37.5576 15.5109 35.7016 12.7308" stroke="#ACE63D" strokeWidth="6" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="text-xl font-semibold">Your Profile</h1>
        </div>

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
            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4 border-2 border-lime-400">
                {profilePicture ? (
                  <img
                    src={profilePicture || "/placeholder.svg"}
                    alt={name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-3xl text-gray-500">👤</span>
                )}
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold">{userProfile?.name}</h2>
                <p className="text-gray-600">{userProfile?.email}</p>
                <span className="inline-block bg-lime-100 text-lime-700 text-xs px-2 py-1 rounded-full mt-2">
                  {userProfile?.role || "Student"}
                </span>
                <p className="mt-2 text-gray-700">{userProfile?.bio || "No bio yet"}</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-center gap-2 p-1 rounded-full bg-green-50 border border-green-100">
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-full ${
                    activeTab === "profile"
                      ? "bg-white shadow-sm"
                      : "text-gray-500 hover:text-lime-600"
                  }`}
                  onClick={() => setActiveTab("profile")}
                >
                  Edit Profile
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-full ${
                    activeTab === "connections"
                      ? "bg-white shadow-sm"
                      : "text-gray-500 hover:text-lime-600"
                  }`}
                  onClick={() => setActiveTab("connections")}
                >
                  Connections
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-full ${
                    activeTab === "events"
                      ? "bg-white shadow-sm"
                      : "text-gray-500 hover:text-lime-600"
                  }`}
                  onClick={() => setActiveTab("events")}
                >
                  Events
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-full ${
                    activeTab === "groups"
                      ? "bg-white shadow-sm"
                      : "text-gray-500 hover:text-lime-600"
                  }`}
                  onClick={() => setActiveTab("groups")}
                >
                  Groups
                </button>
              </div>
            </div>

            {activeTab === "profile" && (
              <form onSubmit={submitHandler}>
                <div className="mb-5">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none bg-gray-100"
                    value={email}
                    disabled
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture URL
                  </label>
                  <input
                    type="text"
                    id="profilePicture"
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none"
                    value={profilePicture}
                    onChange={(e) => setProfilePicture(e.target.value)}
                    placeholder="Enter image URL"
                  />
                </div>

                <div className="mb-5">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself"
                    rows="4"
                  ></textarea>
                </div>

                <div className="mb-5">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Leave blank to keep current password"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <span className="h-5 w-5 text-gray-400">
                        {showPassword ? "👁️" : "👁️‍🗨️"}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none pr-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Leave blank to keep current password"
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <span className="h-5 w-5 text-gray-400">
                        {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                      </span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-lime-400 text-black py-3 px-4 rounded-md hover:bg-lime-500 focus:outline-none font-medium"
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
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4 border border-lime-200">
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
                      <div key={event._id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
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
                      <div key={group._id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
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