import asyncHandler from 'express-async-handler';
import SystemSettings from '../models/systemSettingsModel.js';

// @desc    Get current system settings
// @route   GET /api/system-settings
// @access  Private/Admin
const getSettings = asyncHandler(async (req, res) => {
  const settings = await SystemSettings.findOne();
  res.json(settings || {});
});

// @desc    Update system settings
// @route   PUT /api/system-settings
// @access  Private/Admin
const updateSettings = asyncHandler(async (req, res) => {
  const { maintenanceMode, announcement } = req.body;
  let settings = await SystemSettings.findOne();

  if (settings) {
    settings.maintenanceMode = maintenanceMode;
    settings.announcement = announcement;
    settings.updatedBy = req.user._id;
  } else {
    settings = new SystemSettings({
      maintenanceMode,
      announcement,
      updatedBy: req.user._id,
    });
  }

  const updated = await settings.save();
  res.json(updated);
});

export { getSettings, updateSettings };
