import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFeaturedPosts } from "../slices/postSlice";
import { searchByType } from "../slices/searchSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import PostCard from "../components/PostCard";
import { clearError } from "../slices/postSlice";
import '../styles/DiscussionsPage.css';

const DiscussionsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("featured");
  const [posts, setPosts] = useState([]);

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

  const loading = postsLoading || searchLoading;
  const error = postsError || searchError;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-green-600 mb-4 md:mb-0">Discussions</h1>
        <form onSubmit={handleSearch} className="flex w-full md:w-auto">
          <input
            type="text"
            className="flex-grow md:w-64 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Search discussions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-4 rounded-r-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Search
          </button>
        </form>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`mr-8 py-4 text-sm font-medium ${
                filter === "featured"
                  ? "border-b-2 border-green-500 text-green-600"
                  : "text-gray-500 hover:text-green-600"
              }`}
              onClick={() => setFilter("featured")}
            >
              Featured
            </button>
            {results.posts && results.posts.length > 0 && (
              <button
                className={`mr-8 py-4 text-sm font-medium ${
                  filter === "search"
                    ? "border-b-2 border-green-500 text-green-600"
                    : "text-gray-500 hover:text-green-600"
                }`}
                onClick={() => setFilter("search")}
              >
                Search Results
              </button>
            )}
          </nav>
        </div>
      </div>

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
          <p className="text-gray-600">
            {filter === "search"
              ? "No discussions match your search criteria."
              : "There are no featured discussions at the moment."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscussionsPage;