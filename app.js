import express, { json } from "express"
import dotenv from "dotenv"
import mongoose from "mongoose";


dotenv.config();
const app = express()
const MONGOURL = process.env.MONGO_URL;
app.use(express.json())

const JobSchema = new mongoose.Schema({
    title:String,
    type:String,
    salary:Number,
    description:String,
    company:String,
    logo:String,
    isBookMarked:Boolean,
    location:String,
    experienceLevel:String,
    currency:String,
})

const connectDB = async()=>{
    try{
        await mongoose.connect(MONGOURL,  {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ database is connected successfully")
    }catch(err){
        console.log("❌ database is failed to connect")
        process.exit(1)
    }
}

const jobs = mongoose.model("jobs", JobSchema)

connectDB();


app.get('/',async(req,res)=>{
    const job = await jobs.find()
    res.json(job)
})

app.get('/jobs/:id',async(req,res)=>{
    const item = await jobs.findById(req.params.id)
    res.json(item)
})

app.delete('/jobs/:id',async(req,res)=>{
    const {id} = req.params.id
    const item = await jobs.findOneAndDelete(id)
    res.json(item)
})

app.post('/jobs',async(req,res)=>{
    const newJob = await jobs.create(req.body)
    res.json(newJob)
    
})


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));