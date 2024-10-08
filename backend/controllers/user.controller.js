import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const register = async (req, rep) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return rep.status(400).json({
                message: "Somethig is missing",
                success: false
            })
        }
        const user = await User.findOne({ email });
        if (user) {
            return rep.status(400).json({
                message: "User already exits",
                success: false
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role
        })
        return rep.status(201).json({
            message: "Account created successfully",
            success: true
        })
    }
    catch (error) {
        console.error(error);
    }
}
export const login = async (req, rep) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return rep.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return rep.status(400).json({
                message: "Incorrect email or password",
                success: false,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return rep.status(400).json({
                message: "Incorrect email or password",
                success: false,
            });
        }

        if (role !== user.role) {
            return rep.status(400).json({
                message: "Account doesn't exist with the correct role",
                success: false
            });
        }

        const tokenData = {
            userId: user._id
        };
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        const userResponse = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return rep.status(200).cookie('token', token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user: userResponse,
            success: true
        });
    }
    catch (error) {
        console.log("Something went wrong", error);
        return rep.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const logout = async (req, rep) => {
    try {
        return rep.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out Successfully",
            success: true
        })
    }
    catch (error) {
        console.error("Something went wrong");
    }
}
export const updateProfile = async (req, rep) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;
        let skillsArray;
        if(skills){
         skillsArray = skills.split(",");
        }
        const userId = req.id;
        let user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                succes: false
            })
        }
        // updating data
        if(fullname) user.fullname = fullname;
          if(email) user.email = email;
            if(bio) user.profile.bio = bio;
           if(phoneNumber) user.phoneNumber = phoneNumber;
           if(skills) user.profile.skills = skillsArray;
        // will add resume code later 
        await user.save();
        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }
        return rep.status(200).json({
            message:"Profile updated successfully",
            user,
            success:true
        })
    }
    catch (error) {
        console.error(error);
    }
}