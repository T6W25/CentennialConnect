import asyncHandler from "express-async-handler"
import Job from "../models/jobModel.js"
import User from "../models/userModel.js"

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private
const createJob = asyncHandler(async (req, res) => {
  const { title, company, location, type, category, description, requirements, benefits, salary } = req.body

  const job = await Job.create({
    title,
    company,
    location,
    type,
    category,
    description,
    requirements: requirements || "",
    benefits: benefits || "",
    salary: salary || "",
    employer: req.user._id,
  })

  res.status(201).json(job)
})

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Private
const getJobs = asyncHandler(async (req, res) => {
  const { category, type, status } = req.query

  const filter = {}

  if (category) filter.category = category
  if (type) filter.type = type
  if (status) filter.status = status

  const jobs = await Job.find(filter).populate("employer", "name email profilePicture").sort({ createdAt: -1 })

  res.json(jobs)
})

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Private
const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id)
    .populate("employer", "name email profilePicture")
    .populate("applications.applicant", "name email profilePicture")

  if (job) {
    res.json(job)
  } else {
    res.status(404)
    throw new Error("Job not found")
  }
})

// @desc    Update job status
// @route   PUT /api/jobs/:id/status
// @access  Private
const updateJobStatus = asyncHandler(async (req, res) => {
  const { status } = req.body

  if (!["open", "closed", "filled"].includes(status)) {
    res.status(400)
    throw new Error("Invalid status")
  }

  const job = await Job.findById(req.params.id)

  if (job) {
    // Check if user is the employer
    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      res.status(401)
      throw new Error("Not authorized to update this job")
    }

    job.status = status
    const updatedJob = await job.save()

    res.json(updatedJob)
  } else {
    res.status(404)
    throw new Error("Job not found")
  }
})

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id)

  if (job) {
    // Check if user is the employer
    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      res.status(401)
      throw new Error("Not authorized to delete this job")
    }

    await job.remove()
    res.json({ message: "Job removed" })
  } else {
    res.status(404)
    throw new Error("Job not found")
  }
})

// @desc    Apply for a job
// @route   POST /api/jobs/:id/apply
// @access  Private
const applyForJob = asyncHandler(async (req, res) => {
  const { coverLetter, resume } = req.body
  const job = await Job.findById(req.params.id)

  if (job) {
    // Check if job is open
    if (job.status !== "open") {
      res.status(400)
      throw new Error("This job is no longer accepting applications")
    }

    // Check if user has already applied
    if (job.applications.some((app) => app.applicant.toString() === req.user._id.toString())) {
      res.status(400)
      throw new Error("You have already applied for this job")
    }

    job.applications.push({
      applicant: req.user._id,
      resume,
      coverLetter,
    })

    const updatedJob = await job.save()

    // Notify the employer
    const employer = await User.findById(job.employer)
    if (employer) {
      employer.notifications.push({
        message: `New application for ${job.title} from ${req.user.name}`,
        link: `/jobs/${job._id}`,
      })
      await employer.save()
    }

    res.json(updatedJob)
  } else {
    res.status(404)
    throw new Error("Job not found")
  }
})

// @desc    Update application status
// @route   PUT /api/jobs/:id/applications/:applicationId
// @access  Private
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body

  if (!["pending", "accepted", "rejected"].includes(status)) {
    res.status(400)
    throw new Error("Invalid status")
  }

  const job = await Job.findById(req.params.id)

  if (job) {
    // Check if user is the employer
    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      res.status(401)
      throw new Error("Not authorized to update this application")
    }

    const application = job.applications.id(req.params.applicationId)

    if (!application) {
      res.status(404)
      throw new Error("Application not found")
    }

    application.status = status

    // If accepting, you might want to update other applications or job status
    if (status === "accepted") {
      // Optionally mark job as filled
      // job.status = "filled";

      // Notify the applicant
      const applicant = await User.findById(application.applicant)
      if (applicant) {
        applicant.notifications.push({
          message: `Your application for ${job.title} has been accepted!`,
          link: `/jobs/${job._id}`,
        })
        await applicant.save()
      }
    } else if (status === "rejected") {
      // Notify the applicant
      const applicant = await User.findById(application.applicant)
      if (applicant) {
        applicant.notifications.push({
          message: `Your application for ${job.title} has been rejected.`,
          link: `/jobs/${job._id}`,
        })
        await applicant.save()
      }
    }

    const updatedJob = await job.save()

    res.json(updatedJob)
  } else {
    res.status(404)
    throw new Error("Job not found")
  }
})

export { createJob, getJobs, getJobById, updateJobStatus, deleteJob, applyForJob, updateApplicationStatus }

