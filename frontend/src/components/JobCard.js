// components/JobCard.js
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const daysAgo = (dateString) => {
    const posted = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - posted);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return `${diffDays} days ago`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-5">
        <div className="flex justify-between">
          <div>
            <Link to={`/jobs/${job._id}`} className="inline-block mb-1">
              <h3 className="text-xl font-bold text-gray-800 hover:text-green-600">
                {job.title}
              </h3>
            </Link>
            <p className="text-gray-700 mb-2">{job.company}</p>
            <div className="flex flex-wrap gap-2 mt-2 mb-3">
              <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                {job.location}
              </span>
              <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                {job.type}
              </span>
              {job.isRemote && (
                <span className="inline-block bg-green-100 rounded-full px-3 py-1 text-sm font-semibold text-green-700">
                  Remote
                </span>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-gray-500 text-sm">
              Posted {daysAgo(job.createdAt)}
            </p>
          </div>
        </div>

        <div className="mt-2">
          <p className="text-gray-600 line-clamp-2">{job.description}</p>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div>
            <p className="text-gray-700">
              <span className="font-medium">Salary:</span> {job.salary}
            </p>
          </div>
          
          <div className="flex items-center">
            <p className="text-gray-700 mr-4">
              <span className="font-medium">Deadline:</span> {formatDate(job.deadline)}
            </p>
            <Link
              to={`/jobs/${job._id}`}
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;