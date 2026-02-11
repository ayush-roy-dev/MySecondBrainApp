import { StatusCodes} from "http-status-codes";
import { Controller } from "../types"
import User from "../models/User"

export const signup: Controller = async (req, res) => {
    
    // zod validation 
    const newUser = {
        username: req.body.username,
        password: req.body.password
    }
    if (await User.findOne({username: newUser.username})) {
        res.status(403).json({"msg": "User already exists"})
        return
    }
    const user = await User.create(newUser)
    const token = user.createJWT()
    res.status(200).json({"msg": "signup", "token": token})
}



export const signin: Controller = async (req, res) => {
    const username = req.body.username;
    const password = req.body.username;
    const user = await User.findOne({username})
    if (!user || !user.comparePassword(password)) {
        res.status(403).json({"msg": "Wrong username or password"})
        return
    }
    
    res.status(200).json({"msg": "signin", "token": user.createJWT()})
}

