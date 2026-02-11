import { Router } from "express";
import { getContent, postContent, deleteContent } from "../controllers/content"
import authenticate from "../middlewares/auth";
const contentRouter = Router()

contentRouter.route('/content').get(authenticate, getContent).post(authenticate, postContent).delete(authenticate, deleteContent)

export default contentRouter