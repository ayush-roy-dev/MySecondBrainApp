import UnauthenticatedError from "../errors/unauthenticated";
import { Controller } from "../types";
import jwt from "jsonwebtoken"
import User from "../models/User"

interface JwtPayload {
    userId: string;
}

const authenticate: Controller = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer ")) throw new UnauthenticatedError("Authorization is required to access this route")
    const token = authorization.split(" ")[1]
    
    if (!token) throw new UnauthenticatedError("Authorization is required to access this route")
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
        const user = await User.findOne({ _id: payload.userId })
        if (!user) throw new UnauthenticatedError("Authorization is required to access this route")
        req.userId = user._id.toString()
        next()
    } catch (error) {
        throw new UnauthenticatedError("Authorization is required to access this route")
    }
}

export default authenticate
