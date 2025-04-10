import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/jobApplicationRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import violationRoutes from './routes/violationRoutes.js';
import flaggedPostRoutes from './routes/flaggedPostRoutes.js';
import reportRoutes from "./routes/reportRoutes.js";
import systemSettingsRoutes from "./routes/systemSettingsRoutes.js";
import engagementRoutes from './routes/engagementRoutes.js';
import trackingRoutes from './routes/trackingRoutes.js';
import rsvpRoutes from './routes/rsvpRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/resumes", resumeRoutes);
app.use('/api/violations', violationRoutes);
app.use('/api/flagged-posts', flaggedPostRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/system-settings", systemSettingsRoutes);
app.use('/api/engagements', engagementRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/rsvp', rsvpRoutes);
app.use('/api/announcements', announcementRoutes);


// Static route to serve uploaded resume files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads/resumes", express.static(path.join(__dirname, "/uploads/resumes")));

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
