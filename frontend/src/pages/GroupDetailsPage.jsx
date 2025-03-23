import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Loader from "../components/Loader";
import Message from "../components/Message";
import PostCard from "../components/PostCard";
import '../styles/GroupDetailsPage.css';

const GroupDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [showPostForm, setShowPostForm] = useState(false);
  const [success, setSuccess] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get(`/api/groups/${id}`, config);
        setGroup(data);
        setLoading(false);
      } catch (err) {
        setError(
          err.response && err.response.data.message
            ? err.response.data.message
            : err.message
        );
        setLoading(false);
      }
    };

    fetchGroup();
  }, [id, userInfo.token, success]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.post(
        `/api/groups/${id}/posts`,
        { title: postTitle, content: postContent },
        config
      );
      setPostTitle("");
      setPostContent("");
      setShowPostForm(false);
      setSuccess(!success);
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    }
  };

  const handleJoinGroup = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.put(`/api/groups/${id}/join`, {}, config);
      setSuccess(!success);
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    }
  };

  const isManager = group?.managers?.some((manager) => manager._id === userInfo._id);
  const isAdmin = userInfo?.role === "admin";
  const isCommunityManager = userInfo?.role === "communityManager";
  const canManage = isManager || isAdmin || isCommunityManager;
  const isMember = group?.members?.some((member) => member._id === userInfo._id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        {group?.community && (
          <Link
            to={`/communities/${group.community._id}`}
            className="text-green-600 hover:underline flex items-center"
          >
            <span className="mr-2">←</span> Back to {group.community.name}
          </Link>
        )}
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error" onClose={() => setError(null)}>
          {error}
        </Message>
      ) : group ? (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="h-48 bg-gray-200">
              {group.image ? (
                <img
                  src={group.image || "/placeholder.svg"}
                  alt={group.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-green-100 text-green-600">
                  <span className="text-6xl">👨‍👩‍👧‍👦</span>
                </div>
              )}
            </div>
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-2 text-gray-800">{group.name}</h1>
              <p className="text-gray-600 mb-4">{group.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <span className="mr-1">👥</span>
                  <span>{group.members?.length || 0} members</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-1">📝</span>
                  <span>{group.posts?.length || 0} posts</span>
                </div>
              </div>
              {!isMember && (
                <button
                  onClick={handleJoinGroup}
                  className="mt-4 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Join Group
                </button>
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {group.pinnedPosts?.length > 0 ? "Pinned Posts" : "Posts"}
              </h2>
              {isMember && (
                <button
                  onClick={() => setShowPostForm(!showPostForm)}
                  className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center"
                >
                  <span className="mr-2">{showPostForm ? "-" : "+"}</span>
                  {showPostForm ? "Cancel" : "Create Post"}
                </button>
              )}
            </div>

            {showPostForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Create a New Post</h3>
                <form onSubmit={handlePostSubmit}>
                  <div className="mb-4">
                    <label htmlFor="postTitle" className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      id="postTitle"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="postContent" className="block text-sm font-medium text-gray-700 mb-1">
                      Content
                    </label>
                    <textarea
                      id="postContent"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      rows="4"
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Post
                  </button>
                </form>
              </div>
            )}

            {group.pinnedPosts?.length > 0 && (
              <div className="space-y-4 mb-8">
                {group.pinnedPosts.map((post) => (
                  <div key={post._id} className="border-l-4 border-green-500">
                    <PostCard post={post} />
                  </div>
                ))}
              </div>
            )}

            {group.pinnedPosts?.length > 0 && group.posts?.length > 0 && (
              <h2 className="text-xl font-bold text-gray-800 mb-6">All Posts</h2>
            )}

            {group.posts?.length > 0 ? (
              <div className="space-y-4">
                {group.posts
                  .filter(
                    (post) =>
                      !group.pinnedPosts?.some((pinnedPost) => pinnedPost._id === post._id)
                  )
                  .map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No posts in this group yet.</p>
            )}
          </div>
        </>
      ) : (
        <Message variant="error">Group not found</Message>
      )}
    </div>
  );
};

export default GroupDetailsPage;