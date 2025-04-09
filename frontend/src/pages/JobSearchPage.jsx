// pages/JobSearchPage.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchJobs } from '../slices/jobSlice';
import JobCard from '../components/JobCard';
import JobFilter from '../components/JobFilter';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Pagination from '../components/Pagination';

const JobSearchPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const [currentPage, setCurrentPage] = useState(parseInt(queryParams.get('page')) || 1);
  const [searchQuery, setSearchQuery] = useState(queryParams.get('query') || '');
  const [filters, setFilters] = useState({
    type: queryParams.get('type') || '',
    location: queryParams.get('location') || '',
    isRemote: queryParams.get('remote') === 'true',
  });
  
  const { jobs, loading, error, pages, totalJobs } = useSelector((state) => state.jobs);
  
  // Apply filters and update URL
  const applyFilters = () => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('query', searchQuery);
    if (filters.type) params.set('type', filters.type);
    if (filters.location) params.set('location', filters.location);
    if (filters.isRemote) params.set('remote', 'true');
    if (currentPage > 1) params.set('page', currentPage);
    
    navigate(`/jobs/search?${params.toString()}`);
    
    dispatch(
      searchJobs({
        query: searchQuery,
        page: currentPage,
        ...filters,
      })
    );
  };
  
  // Initial search on component mount and when URL changes
  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, currentPage]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    applyFilters();
  };
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Search Jobs</h1>
      
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Job title, skill, or keyword"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg"
          >
            Search
          </button>
        </form>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <JobFilter onFilterChange={handleFilterChange} initialFilters={filters} />
        </div>
        
        <div className="lg:col-span-3">
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="error">{error}</Message>
          ) : jobs.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow">
              <Message>
                No jobs found matching your search criteria. Try adjusting your filters or search query.
              </Message>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-gray-600">
                  Showing {jobs.length} of {totalJobs} job{totalJobs !== 1 && 's'} matching your search
                </p>
              </div>
              
              <div className="space-y-4">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
              
              {pages > 1 && (
                <div className="mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={pages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSearchPage;