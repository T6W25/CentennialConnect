import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchJobs } from '../slices/jobSlice';
import JobCard from '../components/JobCard';
import JobFilter from '../components/JobFilter';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Pagination from '../components/Pagination';

const JobBoardPage = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    isRemote: false,
  });

  const { jobs, loading, error, pages, totalJobs } = useSelector(
    (state) => state.jobs
  );

  const { userInfo } = useSelector((state) => state.auth);
  const isNonAcademic = userInfo && userInfo.userType === 'non-academic';

  useEffect(() => {
    dispatch(fetchJobs({ page: currentPage, ...filters }));
  }, [dispatch, currentPage, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container py-6 min-h-[80vh] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Board</h1>
        {isNonAcademic && (
          <Link
            to="/jobs/new"
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
          >
            Post a Job
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
        <div className="lg:col-span-1">
          <JobFilter onFilterChange={handleFilterChange} />
        </div>

        <div className="lg:col-span-3 min-h-[300px] flex flex-col">
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="error">{error}</Message>
          ) : jobs.length === 0 ? (
            <Message>No jobs found</Message>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-gray-600">
                  Showing {jobs.length} of {totalJobs} job{totalJobs !== 1 && 's'}
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

export default JobBoardPage;
