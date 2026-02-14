import { Router } from "express";
import { getContent, postContent, deleteContent } from "../controllers/content"
import authenticate from "../middlewares/auth";
const contentRouter = Router()
contentRouter.use(authenticate)
contentRouter.route('/content').get(getContent).post(postContent).delete(deleteContent)

export default contentRouter