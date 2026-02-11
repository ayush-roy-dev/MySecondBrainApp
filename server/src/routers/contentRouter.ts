import { Router } from "express";
import { getContent, postContent, deleteContent, getAllContent } from "../controllers/content"
import authenticate from "../middlewares/auth";
const contentRouter = Router()

contentRouter.route('/content', authenticate).get(getAllContent).post(postContent)
contentRouter.route('/content:contentId').get(getContent).delete(deleteContent)

export default contentRouter