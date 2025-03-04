import z, { string } from "zod"

export const InputSchema = z.object({
    title:z.string().max(100, {message:"title is too long" }),
    type:z.string().max(100, {message:"type is too long"}),
    salary:z.number().min(1,{message:"salary is expected as numeric"}),
    description:z.string(),
    company:z.string().max(100,{message:"company name is too long"}),
    logo:z.string().max(500,{message:"given logo link is too long"}),
    isBookMarked:z.boolean().refine(val => typeof val === "boolean", { 
        message: "This option should be a boolean"
    }),
    location:z.string().max(100,{message:"location is too long"}),
    experienceLevel:z.string().max(100,{message:"experienceLevel is too long"}),
    currency:z.string().max(3,{message:"currency is too long"}),
})