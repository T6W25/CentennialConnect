// pages/JobApplicationsPage.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchJobDetails } from '../slices/jobSlice';
import { fetchJobApplications, updateApplicationStatus } from '../slices/jobApplicationSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Modal from '../components/Modal';

const JobApplicationsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  
  const { job, loading: jobLoading, error: jobError } = useSelector((state) => state.jobs);
  const { applications, loading, error } = useSelector((state) => state.jobApplications);
  
  useEffect(() => {
    dispatch(fetchJobDetails(id));
    dispatch(fetchJobApplications(id));
  }, [dispatch, id]);
  
  const handleStatusChange = (applicationId, newStatus) => {
    setStatusUpdateLoading(true);
    dispatch(updateApplicationStatus({ id: applicationId, status: newStatus }))
      .unwrap()
      .then(() => {
        // Refresh applications after status update
        dispatch(fetchJobApplications(id));
        setStatusUpdateLoading(false);
      })
      .catch((err) => {
        console.error('Failed to update status:', err);
        setStatusUpdateLoading(false);
      });
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'Shortlisted':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Accepted':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  if (jobLoading || loading) return <Loader />;
  if (jobError) return <Message variant="error">{jobError}</Message>;
  if (error) return <Message variant="error">{error}</Message>;
  if (!job) return <Message>Job not found</Message>;
  
  return (
    <div className="container py-6">
      <div className="mb-6">
        <Link to={`/jobs/${id}`} className="text-green-600 hover:underline">
          &larr; Back to Job Details
        </Link>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">Applications for {job.title}</h1>
          <p className="text-gray-600 mb-6">
            {job.company} - {job.location} - {applications.length} application(s)
          </p>
          
          {applications.length === 0 ? (
            <Message>No applications have been submitted for this job yet.</Message>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied On
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((application) => (
                    <tr key={application._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {application.applicant.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {application.applicant.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(application.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            application.status
                          )}`}
                        >
                          {application.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedApplication(application);
                              setShowDetailsModal(true);
                            }}
                            className="text-green-600 hover:text-green-900"
                          >
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* Application Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Application Details"
      >
        {selectedApplication && (
          <div className="p-4">
            <div className="mb-4">
              <h3 className="text-lg font-bold">Applicant Information</h3>
              <p className="text-gray-700">
                <span className="font-medium">Name:</span> {selectedApplication.applicant.name}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Email:</span>{' '}
                <a
                  href={`mailto:${selectedApplication.applicant.email}`}
                  className="text-green-600 hover:underline"
                >
                  {selectedApplication.applicant.email}
                </a>
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Applied On:</span>{' '}
                {formatDate(selectedApplication.createdAt)}
              </p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-bold">Resume</h3>
              <a
                href={selectedApplication.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:underline"
              >
                View Resume
              </a>
            </div>
            
            {selectedApplication.coverLetter && (
              <div className="mb-4">
                <h3 className="text-lg font-bold">Cover Letter</h3>
                <div className="bg-gray-50 p-3 rounded whitespace-pre-line">
                  {selectedApplication.coverLetter}
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <h3 className="text-lg font-bold">Status</h3>
              <div className="mt-2">
                <label className="block text-gray-700 font-medium mb-2">Update Status</label>
                <div className="flex flex-wrap gap-2">
                  {['Pending', 'Reviewed', 'Shortlisted', 'Rejected', 'Accepted'].map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(selectedApplication._id, status)}
                        className={`px-3 py-1 rounded ${
                          selectedApplication.status === status
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                        }`}
                        disabled={statusUpdateLoading}
                      >
                        {status}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
            
            {selectedApplication.notes && (
              <div className="mb-4">
                <h3 className="text-lg font-bold">Notes</h3>
                <div className="bg-gray-50 p-3 rounded whitespace-pre-line">
                  {selectedApplication.notes}
                </div>
              </div>
            )}
            
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default JobApplicationsPage;