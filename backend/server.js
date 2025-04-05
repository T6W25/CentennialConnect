import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js"
import userRoutes from "./routes/userRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import communityRoutes from "./routes/communityRoutes.js"
import groupRoutes from "./routes/groupRoutes.js"
import eventRoutes from "./routes/eventRoutes.js"
import postRoutes from "./routes/postRoutes.js"
import searchRoutes from "./routes/searchRoutes.js"
import { notFound, errorHandler } from "./middleware/errorMiddleware.js"
import jobRoutes from './routes/jobRoutes.js';
//import applicationRoutes from "./routes/applicationRoutes.js";
import applicationRoutes from "./routes/jobApplicationRoutes.js";



dotenv.config()

// Connect to MongoDB
connectDB()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/users", userRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/communities", communityRoutes)
app.use("/api/groups", groupRoutes)
app.use("/api/events", eventRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/search", searchRoutes)
app.use('/api/jobs', jobRoutes);
app.use("/api/applications", applicationRoutes);

// Error Middleware
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// In the server.js file, we import the necessary modules and files, configure the middleware, define the routes, and set up error handling. We also connect to the MongoDB database using the connectDB function defined in the db.js file. Finally, we start the server and listen on the specified port.