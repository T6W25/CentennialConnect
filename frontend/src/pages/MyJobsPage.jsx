// pages/MyJobsPage.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyJobs, deleteJob } from '../slices/jobSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Modal from '../components/Modal';

const MyJobsPage = () => {
  const dispatch = useDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  
  const { jobs, loading, error } = useSelector((state) => state.jobs);
  
  useEffect(() => {
    dispatch(fetchMyJobs());
  }, [dispatch]);
  
  const handleDelete = (id) => {
    dispatch(deleteJob(id))
      .unwrap()
      .then(() => {
        setShowDeleteModal(false);
      })
      .catch((err) => {
        console.error('Failed to delete job:', err);
      });
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const isDeadlinePassed = (deadline) => {
    return new Date(deadline) < new Date();
  };
  
  if (loading) return <Loader />;
  if (error) return <Message variant="error">{error}</Message>;
  
  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Job Listings</h1>
        <Link
          to="/jobs/new"
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
        >
          Post a New Job
        </Link>
      </div>
      
      {jobs.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Message>
            You haven't posted any jobs yet.{' '}
            <Link to="/jobs/new" className="text-green-600 hover:underline">
              Post your first job
            </Link>
          </Message>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <Link
                    to={`/jobs/${job._id}`}
                    className="text-xl font-bold text-gray-800 hover:text-green-600"
                  >
                    {job.title}
                  </Link>
                  <p className="text-gray-600">{job.company}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                      {job.location}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                      {job.type}
                    </span>
                    {job.isRemote && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        Remote
                      </span>
                    )}
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        job.status === 'Open'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                </div>
                
                <div className="space-x-2">
                  <Link
                    to={`/jobs/${job._id}/applications`}
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    View Applications ({job.applications?.length || 0})
                  </Link>
                  <Link
                    to={`/jobs/${job._id}/edit`}
                    className="inline-block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => {
                      setJobToDelete(job);
                      setShowDeleteModal(true);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-700">
                    <span className="font-medium">Deadline:</span>{' '}
                    {formatDate(job.deadline)}
                    {isDeadlinePassed(job.deadline) && (
                      <span className="ml-2 text-red-600">(Passed)</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-gray-700">
                    <span className="font-medium">Posted:</span> {formatDate(job.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-700">
                    <span className="font-medium">Applications:</span>{' '}
                    {job.applications?.length || 0}
                  </p>
                </div>
              </div>
              
              {job.status === 'Closed' && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-md">
                  <p className="text-yellow-800 text-sm">
                    This job listing is closed and is no longer visible to job seekers.
                  </p>
                </div>
              )}
              
              {job.status === 'Open' && isDeadlinePassed(job.deadline) && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-md">
                  <p className="text-yellow-800 text-sm">
                    The application deadline has passed, but the listing is still open. Consider
                    updating the deadline or closing the listing.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Deletion"
      >
        {jobToDelete && (
          <div className="p-4">
            <p className="mb-4">
              Are you sure you want to delete the job posting "{jobToDelete.title}"? This
              action cannot be undone and will also delete all associated applications.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(jobToDelete._id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyJobsPage;