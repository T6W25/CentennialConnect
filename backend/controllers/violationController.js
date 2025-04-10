import Violation from '../models/violationModel.js';
import asyncHandler from 'express-async-handler';

const createViolation = asyncHandler(async (req, res) => {
  const { user, reason, severity, actionTaken } = req.body;

  const violation = await Violation.create({
    user,
    reason,
    severity,
    actionTaken,
    issuedBy: req.user._id,
  });

  res.status(201).json(violation);
});

const getUserViolations = asyncHandler(async (req, res) => {
  const violations = await Violation.find({ user: req.params.id }).sort({ createdAt: -1 });
  res.json(violations);
});

const resolveViolation = asyncHandler(async (req, res) => {
  const violation = await Violation.findById(req.params.id);

  if (!violation) {
    res.status(404).json({ message: 'Violation not found' });
    throw new Error('Violation not found');
  }

  violation.resolved = true;
  const updated = await violation.save();
  res.json(updated);
});

export { createViolation, getUserViolations, resolveViolation };
