import mongoose from 'mongoose';

const systemSettingsSchema = new mongoose.Schema(
  {
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    announcement: {
      type: String,
      default: '',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const SystemSettings = mongoose.model('SystemSettings', systemSettingsSchema);

export default SystemSettings;
