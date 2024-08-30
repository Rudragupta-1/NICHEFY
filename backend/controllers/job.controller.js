import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";  // Make sure to import the Company model

export const postJob = async (req, res) => {
    try {
        const {
            title,
            description,
            requirements,
            salary,
            location,
            jobType,
            experience,
            position,
            companyId
        } = req.body;
        // Correct way to find a company by its ID
        const company = await Company.findById(companyId);
        
        if (!company || company.userId.toString() !== req.id) {
            return res.status(400).json({
                message: "Company not found or not authorized",
                success: false
            });
        }
        const existingJob=await Job.findOne({
            title,
            company:companyId,
            location
        })
        if(existingJob){
            return res.status(400).json({
                message:"Job exist already with the same title,company and location",
                success:false
            })
        }
        // Creating a new job with all the necessary fields
        const newJob = new Job({
            title,
            description,
            requirements,
            salary,
            location,
            jobType,
            experience,
            position,
            company: companyId, // Associate job with the company
            created_by: req.id   // Set the user who created the job
        });

        await newJob.save();

        return res.status(200).json({
            message: "Job posted successfully",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};
