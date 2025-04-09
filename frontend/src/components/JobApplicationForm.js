// components/JobApplicationForm.js
import { useState } from 'react';
import Loader from './Loader';

const JobApplicationForm = ({ onSubmit, loading, jobTitle }) => {
  const [resume, setResume] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeError, setResumeError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!resume.trim()) {
      setResumeError('Resume is required');
      return;
    }
    
    onSubmit({ resume, coverLetter });
  };

  // For the purpose of this demo, we're simulating file upload by using text inputs
  // In a real application, you'd implement file upload functionality here
  // connecting to a storage service like AWS S3, Google Cloud Storage, etc.

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Applying for: {jobTitle}
        </label>
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2" htmlFor="resume">
          Resume URL <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="resume"
          className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 ${
            resumeError ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Link to your resume (Google Drive, Dropbox, etc.)"
          value={resume}
          onChange={(e) => {
            setResume(e.target.value);
            if (e.target.value.trim()) {
              setResumeError('');
            }
          }}
          required
        />
        {resumeError && <p className="text-red-500 text-sm mt-1">{resumeError}</p>}
        <p className="text-gray-500 text-sm mt-1">
          Please provide a link to your resume document
        </p>
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2" htmlFor="coverLetter">
          Cover Letter
        </label>
        <textarea
          id="coverLetter"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          rows="6"
          placeholder="Why are you a good fit for this position?"
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
        ></textarea>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          disabled={loading}
        >
          {loading ? <Loader small /> : 'Submit Application'}
        </button>
      </div>
    </form>
  );
};

export default JobApplicationForm;