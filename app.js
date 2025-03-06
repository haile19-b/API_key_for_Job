import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { InputSchema } from "./zod.js";
import cors from "cors";
import { string } from "zod";

dotenv.config();
const app = express();
const MONGOURL = process.env.MONGO_URL;

app.use(express.json());
app.use(cors());

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
    salary: String,
    description: String,
    company: String,
    logo: String,
    isBookMarked: Boolean,
    location: String,
    experienceLevel: String,
    currency: String,
},{timestamps:true});

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
    try{
        let {page = 1, limit = 2} = req.query
        page = parseInt(page)
        limit = parseInt(limit)
        const total = await Job.countDocuments()
        const jobs = await Job.find()
        .sort({ createdAt:-1 })
        .skip((page - 1) * limit)
        .limit(limit);
        if(!jobs){
            return res.status(404).json({message:"no item is found with this id"})
        }
        res.status(200).json({
            total,
            page,
            limit,
            jobs
        });
    }catch(err){
        res.status(404).json(err)
        process.exit(1)
    }
});

app.get("/jobs/:id", async (req, res) => {
    try{
        const job = await Job.findById(req.params.id);
        res.status(200).json(job);
    }catch(err){
        res.status(404).json({message:"there may be no item with this id ",err})
    }
});

app.delete("/jobs/:id", async (req, res) => {
    try{
        const deletedJob = await Job.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Job deleted successfully", deletedJob });
    }catch(err){
        res.status(400).json({message:"there may be no item with this id ", err})
    }
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
