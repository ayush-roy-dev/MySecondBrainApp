import { Router } from "express";
import { signup, signin } from "../controllers/auth";
const authRouter = Router()

authRouter.route('/signup').post(signup)
authRouter.route('/signin').post(signin)

export default authRouter