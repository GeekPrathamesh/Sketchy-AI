import jwt from "jsonwebtoken";
import User from "../models/userschema.js";

export const protectShield=async(req,res,next)=>{
    let token = req.headers.authorization;
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const userId = decoded.id;
        const user = await User.findById(userId).select("-password");
        if(!user) return res.json({success:false,message:"user not found"});
        req.user = user;
        next();
    } catch (error) {
        return res.json({success:false,message:"not authorized token is failed"})
    
    }
}