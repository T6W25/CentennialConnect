import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchAll, clearResults } from "../slices/searchSlice";
import '../styles/SearchPage.css';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="bg-lime-400 py-3 px-4">
        <div className="container mx-auto flex items-center">
          <h1 className="text-xl font-semibold text-white">Connect</h1>
        </div>
      </div>
      <div className="container mx-auto px-4 py-6 flex-shrink-0">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6 max-w-3xl mx-auto">
          <h2 className="text-lg font-semibold mb-4 text-lime-600">Search</h2>
          <form onSubmit={handleSearch} className="w-full">
            <div className="flex w-full">
              <input
                type="text"
                className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-gray-300 bg-white text-gray-800 placeholder-gray-500"
                placeholder="Search for users, communities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                required
              />
              <button
                type="submit"
                className="search-button"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
