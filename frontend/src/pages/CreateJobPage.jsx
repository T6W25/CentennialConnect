// pages/CreateJobPage.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { createJob } from '../slices/jobSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';

const CreateJobPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error } = useSelector((state) => state.jobs);
  
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [type, setType] = useState('Full-time');
  const [salary, setSalary] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isRemote, setIsRemote] = useState(false);
  const [skills, setSkills] = useState('');
  
  // Form validation
  const [errors, setErrors] = useState({});
  
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
    };
    
    dispatch(createJob(jobData))
      .unwrap()
      .then((res) => {
        navigate(`/jobs/${res._id}`);
      })
      .catch((err) => {
        console.error('Failed to create job:', err);
      });
  };
  
  return (
    <div className="container py-6">
      <div className="mb-6">
        <Link to="/jobs" className="text-green-600 hover:underline">
          &larr; Back to Job Board
        </Link>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
        <h1 className="text-2xl font-bold mb-6">Post a New Job</h1>
        
        {error && <Message variant="error">{error}</Message>}
        
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
                min={new Date().toISOString().split('T')[0]} // Set min date to today
              />
              {errors.deadline && (
                <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>
              )}
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
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading ? <Loader small /> : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJobPage;