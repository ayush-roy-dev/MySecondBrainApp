import { Router } from "express";
import signup from "../controllers/signup";
import signin from "../controllers/signin";
const authRouter = Router()

authRouter.route('/signup').post(signup)
authRouter.route('/signin').post(signin)

export default authRouter