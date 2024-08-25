import {User} from "../models/user.model.js";
import bcrypt from "bcrypt.js";
export const register = async(req,rep)=>{
    try{
        const {fullname , email , phonenumber ,password, role}=req.body;
        if(!fullname || !email || !phonenumber || !password || !role){
            return rep.status(400).json({
                message:"Somethig is missing",
                success:false
            })
        }
        const user=await User.findOne({email});
        if(user){
            return rep.status(400).json({
                message:"User already exits",
                success:false
            })
        }
        const hashedPassword=await bcrypt.hash(password,10);
        await User.createOne({
            fullname ,
            email,
            phonenumber,
            password:hashedPassword,
            role
        })
    }
    catch(error){
        console.error("Something went wrong");
    }
}