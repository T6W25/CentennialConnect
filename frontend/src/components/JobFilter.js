// components/JobFilter.js
import { useState, useEffect } from 'react';

const JobFilter = ({ onFilterChange }) => {
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [isRemote, setIsRemote] = useState(false);
  const [keyword, setKeyword] = useState('');

  // Popular locations for quick selection
  const popularLocations = [
    'New York',
    'San Francisco',
    'London',
    'Toronto',
    'Berlin',
    'Singapore',
  ];

  useEffect(() => {
    // Debounce filter changes to prevent excessive API calls
    const timeoutId = setTimeout(() => {
      onFilterChange({
        type,
        location,
        isRemote,
        keyword: keyword.trim(),
      });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [type, location, isRemote, keyword, onFilterChange]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Filter Jobs</h2>

      <div className="mb-4">
        <label htmlFor="keyword" className="block mb-2 font-medium text-gray-700">
          Search
        </label>
        <input
          type="text"
          id="keyword"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Job title, skill, or keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="jobType" className="block mb-2 font-medium text-gray-700">
          Job Type
        </label>
        <select
          id="jobType"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="location" className="block mb-2 font-medium text-gray-700">
          Location
        </label>
        <input
          type="text"
          id="location"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="City or Country"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        
        <div className="mt-2 flex flex-wrap gap-2">
          {popularLocations.map((loc) => (
            <button
              key={loc}
              type="button"
              className="text-xs bg-gray-100 hover:bg-gray-200 rounded-full px-2 py-1"
              onClick={() => setLocation(loc)}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-green-600"
            checked={isRemote}
            onChange={(e) => setIsRemote(e.target.checked)}
          />
          <span className="ml-2 text-gray-700">Remote Only</span>
        </label>
      </div>

      <button
        type="button"
        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
        onClick={() => {
          setType('');
          setLocation('');
          setIsRemote(false);
          setKeyword('');
        }}
      >
        Clear Filters
      </button>
    </div>
  );
};

export default JobFilter;