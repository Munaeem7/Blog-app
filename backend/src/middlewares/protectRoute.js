import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
export const protectRoute= async (req,res,next) => {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({message: "unauthorized token"})
    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if (err) {
            return res.status(403).json({message: "Forbidden: Invalid token"})
        }
        
        req.user = user
        next() 
        })
}