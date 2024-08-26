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
        return rep.status(201).json({
            message:"Account created successfully",
            success:true
        })
    }
    catch(error){
        console.error("Something went wrong");
    }
}
export const login =async(req,rep)=>{
    try{
        const{email,password,role}=req.body;
        if(!email || !password || !role){
            return rep.status(400).json({
                message:"Somethig is missing",
                success:false
            })
        }
        const user=await User.findOne({email});
            if(!user){
                return rep.status(400).json({
                    message:"Incorrect email or password",
                    success:false,
                })
            }
            const isPasswordMatch=await bcrypt.compare(password,user.password);
            if(!isPasswordMatch){
                return rep.status(400).json({
                    message:"Incorrect email or password",
                    success:false,
                })
            }
            if(role!==user.role){
                return resizeBy.status(400).json({
                    message:"Account doesn't exist with currect role",
                    success:false
                })
            }
            const tokenData={
                userId:user._id
            }
            const token=await jwt.sign(tokenData,process.env.SECRET_KEY,{expires:'1d'});
            user={
                _id:user._id,
                fullname:user.fullname,
                email:user.email,
                phoneNumber:user.phoneNumber,
                role:user.role,
                profile:user.profile
            }
            return resizeBy.status(200).cookie('token',token,{maxAge:1*24*60*60*1000,httpsOnly:true,sameSite:'strict'}).json({
                message:`Welcome back ${user.fullname}`,
                user,
                success:true
            })
    }
    catch (error){
        console.log("Something went wrong");
    }
}

export const logout=async(req,rep)=>{
    try{
        return rep.status(200).cookie("token","",{maxAge:0}).json({
            message:"Logged out Successfully",
            success:true
        })
    }
    catch(error){
        console.error("Something went wrong");
    }
}