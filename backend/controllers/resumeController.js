import asyncHandler from 'express-async-handler';
import Resume from '../models/resumeModel.js';
import path from 'path';
import fs from 'fs';


const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const resume = new Resume({
    user: req.user._id,
    fileUrl: `/uploads/resumes/${req.file.filename}`,
    originalFileName: req.file.originalname,
    contentType: req.file.mimetype,
  });

  const savedResume = await resume.save();
  res.status(201).json(savedResume);
});


const getUserResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ user: req.user._id }).sort({ uploadedAt: -1 });
  res.json(resumes);
});


const deleteResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findById(req.params.id);

  if (!resume) {
    res.status(404);
    throw new Error('Resume not found');
  }

  if (resume.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this resume');
  }

  const filePath = path.join('backend/uploads/resumes', path.basename(resume.fileUrl));
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  await resume.remove();
  res.json({ message: 'Resume deleted successfully' });
});

export { uploadResume, getUserResumes, deleteResume };
