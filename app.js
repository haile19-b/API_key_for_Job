import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { InputSchema } from "./zod.js";

dotenv.config();
const app = express();
const MONGOURL = process.env.MONGO_URL;

app.use(express.json());

const validator = (schema) => (req,res,next)=>{
    const result = schema.safeParse(req.body)
    if(!result.success){
        return res.status(400).json({errors:result.error.format()})
    };
    next();
}

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

const connectDB = async () => {
    try {
        await mongoose.connect(MONGOURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database connected successfully");
    } catch (err) {
        console.error("Database connection failed:", err);
        setTimeout(connectDB, 5000);
    }
};

connectDB();

app.get("/", (req, res) => {
    res.json({ message: "Working..." });
});

app.get("/jobs", async (req, res) => {
        const jobs = await Job.find();
        res.status(200).json(jobs);
});

app.get("/jobs/:id", async (req, res) => {
        const job = await Job.findById(req.params.id);
        res.status(200).json(job);
});

app.delete("/jobs/:id", async (req, res) => {
        const deletedJob = await Job.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Job deleted successfully", deletedJob });
});

app.post("/jobs",validator(InputSchema) , async (req, res) => {
    try{
        const newJob = await Job.create(req.body)
        res.json({message:"job is posted successfully ",job:newJob})
    }catch(err){
        res.json({message:"failed to fetch the data"})
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
