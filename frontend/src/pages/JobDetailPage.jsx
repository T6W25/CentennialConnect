// pages/JobDetailPage.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchJobDetails, deleteJob } from '../slices/jobSlice';
import { applyForJob } from '../slices/jobApplicationSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Modal from '../components/Modal';
import JobApplicationForm from '../components/JobApplicationForm';

const JobDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { job, loading, error } = useSelector((state) => state.jobs);
  const { userInfo } = useSelector((state) => state.auth);
  const { loading: applyLoading, success: applySuccess, error: applyError } = useSelector(
    (state) => state.jobApplications
  );

  const isJobPoster = job && userInfo && job.postedBy._id === userInfo._id;
  const isDeadlinePassed = job && new Date(job.deadline) < new Date();

  useEffect(() => {
    dispatch(fetchJobDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (applySuccess) {
      setShowApplicationModal(false);
    }
  }, [applySuccess]);

  const handleApply = (formData) => {
    dispatch(applyForJob({ jobId: id, applicationData: formData }));
  };

  const handleDelete = () => {
    dispatch(deleteJob(id))
      .unwrap()
      .then(() => {
        navigate('/jobs');
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

  if (loading) return <Loader />;
  if (error) return <Message variant="error">{error}</Message>;
  if (!job) return <Message>Job not found</Message>;

  return (
    <div className="container py-6">
      <div className="mb-6">
        <Link to="/jobs" className="text-green-600 hover:underline">
          &larr; Back to Job Board
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{job.title}</h1>
              <div className="text-lg text-gray-700 mt-1">{job.company}</div>
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
              </div>
            </div>

            <div className="text-right">
              {isJobPoster ? (
                <div className="space-x-2">
                  <Link
                    to={`/jobs/${job._id}/applications`}
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded inline-block"
                  >
                    View Applications
                  </Link>
                  <Link
                    to={`/jobs/${job._id}/edit`}
                    className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded inline-block"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowApplicationModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                  disabled={isDeadlinePassed || job.status === 'Closed'}
                >
                  {isDeadlinePassed || job.status === 'Closed'
                    ? 'Applications Closed'
                    : 'Apply Now'}
                </button>
              )}
            </div>
          </div>

          <div className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <span className="font-semibold">Salary:</span> {job.salary}
              </div>
              <div>
                <span className="font-semibold">Application Deadline:</span>{' '}
                {formatDate(job.deadline)}
              </div>
              <div>
                <span className="font-semibold">Posted On:</span>{' '}
                {formatDate(job.createdAt)}
              </div>
              <div>
                <span className="font-semibold">Status:</span>{' '}
                <span
                  className={`px-2 py-1 rounded ${
                    job.status === 'Open'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {job.status}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{job.description}</p>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Requirements</h2>
              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{job.requirements}</p>
              </div>
            </div>

            {job.skills && job.skills.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Contact</h2>
              <p>
                For more information, please contact:{' '}
                <a
                  href={`mailto:${job.contactEmail}`}
                  className="text-green-600 hover:underline"
                >
                  {job.contactEmail}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        title="Apply for Job"
      >
        {applyError && <Message variant="error">{applyError}</Message>}
        <JobApplicationForm
          onSubmit={handleApply}
          loading={applyLoading}
          jobTitle={job.title}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Deletion"
      >
        <div className="p-4">
          <p className="mb-4">
            Are you sure you want to delete this job posting? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default JobDetailPage;