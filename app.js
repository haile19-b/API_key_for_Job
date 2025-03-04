import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const app = express();
const MONGOURL = process.env.MONGO_URL;

// Middleware
app.use(express.json());

// Job Schema
const JobSchema = new mongoose.Schema({
    title: String,
    type: String,
    salary: Number,
    description: String,
    company: String,
    logo: String,
    isBookMarked: Boolean,
    location: String,
    experienceLevel: String,
    currency: String,
});

const Job = mongoose.model("Job", JobSchema);

// Database Connection with Error Handling
const connectDB = async () => {
    try {
        await mongoose.connect(MONGOURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Database connected successfully");
    } catch (err) {
        console.error("❌ Database connection failed:", err);
        setTimeout(connectDB, 5000); // Retry after 5 seconds
    }
};

connectDB();

// Routes
app.get("/", (req, res) => {
    res.json({ message: "Working..." });
});

// ✅ Get all jobs
app.get("/jobs", async (req, res) => {
    try {
        const jobs = await Job.find();
        res.status(200).json(jobs);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
});

// ✅ Get a job by ID
app.get("/jobs/:id", async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Job not found" });
        res.status(200).json(job);
    } catch (err) {
        res.status(500).json({ error: "Invalid Job ID" });
    }
});

// ✅ Delete a job by ID
app.delete("/jobs/:id", async (req, res) => {
    try {
        const deletedJob = await Job.findByIdAndDelete(req.params.id);
        if (!deletedJob) return res.status(404).json({ message: "Job not found" });
        res.status(200).json({ message: "Job deleted successfully", deletedJob });
    } catch (err) {
        res.status(500).json({ error: "Error deleting job" });
    }
});

// ✅ Create a new job
app.post("/jobs", async (req, res) => {
    try {
        const newJob = new Job(req.body);
        await newJob.save();
        res.status(201).json({ message: "Job created successfully", job: newJob });
    } catch (err) {
        res.status(500).json({ error: "Error creating job" });
    }
});

// Start server with correct PORT (for Render)
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
