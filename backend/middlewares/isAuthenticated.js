import jwt from 'jsonwebtoken';
const isAuthenticated=async (req,rep,next)=>{
    try{
        const token=req.cookies.token;
        if(!token){
            rep.status(400).json({
                message:"User not authenticated",
                success:false
            })
        }
        const decode=await jwt.verify(token,process.env.SECRET_KEY);
        if(!decode){
            rep.status(400).json({
                message:"Invalid token",
                success:false
        })
    }
        req.id=decode.userId;
        next();
    }
    catch(error){
        console.log(error);
    }
}
export default isAuthenticated;