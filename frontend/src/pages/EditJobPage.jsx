// pages/EditJobPage.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchJobDetails, updateJob } from '../slices/jobSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';

const EditJobPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { job, loading, error, success } = useSelector((state) => state.jobs);
  const { userInfo } = useSelector((state) => state.auth);
  
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [type, setType] = useState('');
  const [salary, setSalary] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isRemote, setIsRemote] = useState(false);
  const [skills, setSkills] = useState('');
  const [status, setStatus] = useState('');
  
  // Form validation
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    dispatch(fetchJobDetails(id));
  }, [dispatch, id]);
  
  useEffect(() => {
    if (job) {
      // Check if the user is the job creator
      if (userInfo && job.postedBy && job.postedBy._id !== userInfo._id) {
        navigate(`/jobs/${id}`);
      }
      
      setTitle(job.title || '');
      setCompany(job.company || '');
      setLocation(job.location || '');
      setDescription(job.description || '');
      setRequirements(job.requirements || '');
      setType(job.type || 'Full-time');
      setSalary(job.salary || '');
      setContactEmail(job.contactEmail || '');
      setDeadline(job.deadline ? job.deadline.split('T')[0] : '');
      setIsRemote(job.isRemote || false);
      setSkills(job.skills ? job.skills.join(', ') : '');
      setStatus(job.status || 'Open');
    }
  }, [job, userInfo, id, navigate]);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!company.trim()) newErrors.company = 'Company is required';
    if (!location.trim()) newErrors.location = 'Location is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!requirements.trim()) newErrors.requirements = 'Requirements are required';
    if (!contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(contactEmail)) {
      newErrors.contactEmail = 'Invalid email format';
    }
    if (!deadline) newErrors.deadline = 'Application deadline is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Format skills as array
    const skillsArray = skills
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
    
    const jobData = {
      title,
      company,
      location,
      description,
      requirements,
      type,
      salary: salary || 'Not specified',
      contactEmail,
      deadline,
      isRemote,
      skills: skillsArray,
      status,
    };
    
    dispatch(updateJob({ id, jobData }))
      .unwrap()
      .then(() => {
        navigate(`/jobs/${id}`);
      })
      .catch((err) => {
        console.error('Failed to update job:', err);
      });
  };
  
  const isDeadlinePassed = () => {
    return new Date(deadline) < new Date();
  };
  
  if (loading) return <Loader />;
  if (error) return <Message variant="error">{error}</Message>;
  if (!job) return <Message>Job not found</Message>;
  
  return (
    <div className="container py-6">
      <div className="mb-6">
        <Link to={`/jobs/${id}`} className="text-green-600 hover:underline">
          &larr; Back to Job Details
        </Link>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Job Listing</h1>
        
        {success && (
          <Message variant="success">Job updated successfully</Message>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                className={`w-full px-3 py-2 border rounded ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>
            
            <div>
              <label htmlFor="company" className="block text-gray-700 font-medium mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="company"
                className={`w-full px-3 py-2 border rounded ${
                  errors.company ? 'border-red-500' : 'border-gray-300'
                }`}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
              {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
            </div>
            
            <div>
              <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="location"
                className={`w-full px-3 py-2 border rounded ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                }`}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Country"
              />
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>
            
            <div>
              <label htmlFor="type" className="block text-gray-700 font-medium mb-2">
                Job Type <span className="text-red-500">*</span>
              </label>
              <select
                id="type"
                className="w-full px-3 py-2 border border-gray-300 rounded"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="salary" className="block text-gray-700 font-medium mb-2">
                Salary
              </label>
              <input
                type="text"
                id="salary"
                className="w-full px-3 py-2 border border-gray-300 rounded"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="e.g. $50,000 - $70,000 per year"
              />
            </div>
            
            <div>
              <label htmlFor="contactEmail" className="block text-gray-700 font-medium mb-2">
                Contact Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="contactEmail"
                className={`w-full px-3 py-2 border rounded ${
                  errors.contactEmail ? 'border-red-500' : 'border-gray-300'
                }`}
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
              {errors.contactEmail && (
                <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="deadline" className="block text-gray-700 font-medium mb-2">
                Application Deadline <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="deadline"
                className={`w-full px-3 py-2 border rounded ${
                  errors.deadline ? 'border-red-500' : 'border-gray-300'
                }`}
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
              {errors.deadline && (
                <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>
              )}
              {deadline && isDeadlinePassed() && (
                <p className="text-yellow-600 text-sm mt-1">
                  This deadline has already passed. Consider updating it.
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="status" className="block text-gray-700 font-medium mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                className="w-full px-3 py-2 border border-gray-300 rounded"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="skills" className="block text-gray-700 font-medium mb-2">
                Required Skills
              </label>
              <input
                type="text"
                id="skills"
                className="w-full px-3 py-2 border border-gray-300 rounded"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. JavaScript, React, Node.js (comma-separated)"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-green-600"
                  checked={isRemote}
                  onChange={(e) => setIsRemote(e.target.checked)}
                />
                <span className="ml-2 text-gray-700">This is a remote position</span>
              </label>
            </div>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Job Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              rows="6"
              className={`w-full px-3 py-2 border rounded ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="requirements" className="block text-gray-700 font-medium mb-2">
              Job Requirements <span className="text-red-500">*</span>
            </label>
            <textarea
              id="requirements"
              rows="6"
              className={`w-full px-3 py-2 border rounded ${
                errors.requirements ? 'border-red-500' : 'border-gray-300'
              }`}
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
            ></textarea>
            {errors.requirements && (
              <p className="text-red-500 text-sm mt-1">{errors.requirements}</p>
            )}
          </div>
          
          <div className="flex justify-end space-x-4">
            <Link
              to={`/jobs/${id}`}
              className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={loading}
            >
              {loading ? <Loader small /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJobPage;