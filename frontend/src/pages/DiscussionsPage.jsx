import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFeaturedPosts, createPost, upvotePost, downvotePost, clearError } from "../slices/postSlice";
import { searchByType } from "../slices/searchSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import PostCard from "../components/PostCard";
import "../styles/DiscussionsPage.css";

const DiscussionsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("featured");
  const [posts, setPosts] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    codeSnippet: "",
  });

  const dispatch = useDispatch();
  const { featuredPosts, loading: postsLoading, error: postsError } = useSelector((state) => state.posts);
  const { results, loading: searchLoading, error: searchError } = useSelector((state) => state.search);

  useEffect(() => {
    dispatch(getFeaturedPosts());
  }, [dispatch]);

  useEffect(() => {
    if (filter === "featured") {
      setPosts(featuredPosts);
    } else if (filter === "search" && results.posts) {
      setPosts(results.posts);
    }
  }, [filter, featuredPosts, results]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      dispatch(searchByType({ query: searchTerm, type: "posts" }));
      setFilter("search");
    }
  };

  const handleUpvote = (postId) => {
    dispatch(upvotePost(postId));
  };

  const handleDownvote = (postId) => {
    dispatch(downvotePost(postId));
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (newPost.title.trim() && newPost.description.trim()) {
      dispatch(createPost(newPost));
      setNewPost({ title: "", description: "", codeSnippet: "" });
      setShowCreateForm(false);
      dispatch(getFeaturedPosts()); // Ensures the new post appears instantly
    }
  };

  const loading = postsLoading || searchLoading;
  const error = postsError || searchError;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-600">Discussions</h1>

        {/* Buttons & Search */}
        <div className="flex gap-4">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-green-600 text-white py-2 px-5 rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            {showCreateForm ? "Cancel" : "Create Post"}
          </button>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex w-full md:w-auto">
            <input
              type="text"
              className="flex-grow md:w-64 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-green-500"
              placeholder="Search discussions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded-r-md hover:bg-green-700"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Create Post Form */}
      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6 transition-opacity animate-fade-in">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Create a New Discussion</h2>
          <form onSubmit={handleCreatePost} className="space-y-4">
            <input
              type="text"
              placeholder="Discussion Title"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Describe your issue or question..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              rows="3"
              value={newPost.description}
              onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
              required
            />
            <textarea
              placeholder="Optional"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono focus:ring-2 focus:ring-green-500"
              rows="4"
              value={newPost.codeSnippet}
              onChange={(e) => setNewPost({ ...newPost, codeSnippet: e.target.value })}
            />
            <button type="submit" className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700">
              Post Discussion
            </button>
          </form>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="mb-6">
        <nav className="flex border-b border-gray-200">
          <button
            className={`mr-6 py-3 text-sm font-medium ${
              filter === "featured" ? "border-b-2 border-green-500 text-green-600" : "text-gray-500 hover:text-green-600"
            }`}
            onClick={() => setFilter("featured")}
          >
            Featured
          </button>
          {results.posts && results.posts.length > 0 && (
            <button
              className={`mr-6 py-3 text-sm font-medium ${
                filter === "search" ? "border-b-2 border-green-500 text-green-600" : "text-gray-500 hover:text-green-600"
              }`}
              onClick={() => setFilter("search")}
            >
              Search Results
            </button>
          )}
        </nav>
      </div>

      {/* Posts Section */}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="error" onClose={() => dispatch(clearError())}>
          {error}
        </Message>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💬</div>
          <h2 className="text-2xl font-semibold mb-2">No discussions found</h2>
          <p className="text-gray-600">No featured discussions at the moment.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onUpvote={handleUpvote} onDownvote={handleDownvote} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscussionsPage;
