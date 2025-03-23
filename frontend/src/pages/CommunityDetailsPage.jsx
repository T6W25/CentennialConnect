import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getCommunityById,
  createCommunityPost,
  createCommunityGroup,
  clearError,
  resetSuccess,
} from "../slices/communitySlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import PostCard from "../components/PostCard";
import '../styles/CommunityDetailsPage.css';

const CommunityDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("posts");
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [showPostForm, setShowPostForm] = useState(false);
  const [showGroupForm, setShowGroupForm] = useState(false);

  const { community, loading, error, success } = useSelector((state) => state.communities);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getCommunityById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (success) {
      setPostTitle("");
      setPostContent("");
      setGroupName("");
      setGroupDescription("");
      setShowPostForm(false);
      setShowGroupForm(false);
      dispatch(resetSuccess());
    }
  }, [success, dispatch]);

  const handlePostSubmit = (e) => {
    e.preventDefault();
    dispatch(
      createCommunityPost({
        id,
        postData: {
          title: postTitle,
          content: postContent,
        },
      })
    );
  };

  const handleGroupSubmit = (e) => {
    e.preventDefault();
    dispatch(
      createCommunityGroup({
        id,
        groupData: {
          name: groupName,
          description: groupDescription,
        },
      })
    );
  };

  const isManager = community?.managers?.some((manager) => manager._id === userInfo._id);
  const isAdmin = userInfo?.role === "admin";
  const isCommunityManager = userInfo?.role === "communityManager";
  const canManage = isManager || isAdmin || isCommunityManager;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/communities" className="text-green-600 hover:underline flex items-center">
          <span className="mr-2">←</span> Back to Communities
        </Link>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error" onClose={() => dispatch(clearError())}>
          {error}
        </Message>
      ) : community ? (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="h-48 bg-gray-200">
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
            <div className="p-6">
              <h1 className="text-3xl font-bold mb-2 text-gray-800">{community.name}</h1>
              <p className="text-gray-600 mb-4">{community.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <span className="mr-1">👥</span>
                  <span>{community.members?.length || 0} members</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-1">👨‍👩‍👧‍👦</span>
                  <span>{community.groups?.length || 0} groups</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-1">📝</span>
                  <span>{community.posts?.length || 0} posts</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  className={`mr-8 py-4 text-sm font-medium ${
                    activeTab === "posts"
                      ? "border-b-2 border-green-500 text-green-600"
                      : "text-gray-500 hover:text-green-600"
                  }`}
                  onClick={() => setActiveTab("posts")}
                >
                  Posts
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
                <button
                  className={`mr-8 py-4 text-sm font-medium ${
                    activeTab === "members"
                      ? "border-b-2 border-green-500 text-green-600"
                      : "text-gray-500 hover:text-green-600"
                  }`}
                  onClick={() => setActiveTab("members")}
                >
                  Members
                </button>
              </nav>
            </div>
          </div>

          {activeTab === "posts" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {community.pinnedPosts?.length > 0 ? "Pinned Posts" : "Posts"}
                </h2>
                <button
                  onClick={() => setShowPostForm(!showPostForm)}
                  className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center"
                >
                  <span className="mr-2">{showPostForm ? "-" : "+"}</span>
                  {showPostForm ? "Cancel" : "Create Post"}
                </button>
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

              {community.pinnedPosts?.length > 0 && (
                <div className="space-y-4 mb-8">
                  {community.pinnedPosts.map((post) => (
                    <div key={post._id} className="border-l-4 border-green-500">
                      <PostCard post={post} />
                    </div>
                  ))}
                </div>
              )}

              {community.pinnedPosts?.length > 0 && community.posts?.length > 0 && (
                <h2 className="text-xl font-bold text-gray-800 mb-6">All Posts</h2>
              )}

              {community.posts?.length > 0 ? (
                <div className="space-y-4">
                  {community.posts
                    .filter(
                      (post) =>
                        !community.pinnedPosts?.some((pinnedPost) => pinnedPost._id === post._id)
                    )
                    .map((post) => (
                      <PostCard key={post._id} post={post} />
                    ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No posts in this community yet.</p>
              )}
            </div>
          )}

          {activeTab === "groups" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Groups</h2>
                {canManage && (
                  <button
                    onClick={() => setShowGroupForm(!showGroupForm)}
                    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center"
                  >
                    <span className="mr-2">{showGroupForm ? "-" : "+"}</span>
                    {showGroupForm ? "Cancel" : "Create Group"}
                  </button>
                )}
              </div>

              {showGroupForm && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Create a New Group</h3>
                  <form onSubmit={handleGroupSubmit}>
                    <div className="mb-4">
                      <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        id="groupName"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="groupDescription" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        id="groupDescription"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        rows="4"
                        value={groupDescription}
                        onChange={(e) => setGroupDescription(e.target.value)}
                        required
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      Create Group
                    </button>
                  </form>
                </div>
              )}

              {community.groups?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {community.groups.map((group) => (
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
                        <h3 className="text-lg font-semibold mb-2">{group.name}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{group.description}</p>
                        <Link
                          to={`/groups/${group._id}`}
                          className="text-green-600 hover:underline"
                        >
                          View Group
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No groups in this community yet.</p>
              )}
            </div>
          )}

          {activeTab === "members" && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">Members</h2>
              {community.members?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {community.members.map((member) => (
                    <div key={member._id} className="bg-white rounded-lg shadow-md p-4 flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                        {member.profilePicture ? (
                          <img
                            src={member.profilePicture || "/placeholder.svg"}
                            alt={member.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-500">👤</span>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold">{member.name}</div>
                        <div className="text-sm text-gray-600">{member.email}</div>
                        {community.managers?.some((manager) => manager._id === member._id) && (
                          <span className="inline-block bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full mt-1">
                            Manager
                          </span>
                        )}
                        {member._id === community.creator?._id && (
                          <span className="inline-block bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full mt-1 ml-1">
                            Creator
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No members in this community yet.</p>
              )}
            </div>
          )}
        </>
      ) : (
        <Message variant="error">Community not found</Message>
      )}
    </div>
  );
};

export default CommunityDetailsPage;