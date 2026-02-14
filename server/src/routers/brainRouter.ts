import { Router } from "express";
import authenticate from "../middlewares/auth";
import { accessBrain, shareBrain } from "../controllers/brain";

const shareRouter = Router()
shareRouter.use(authenticate)

shareRouter.route('/brain/share').post(shareBrain)
shareRouter.route('/brain/:shareLink').get(accessBrain)

export default shareRouter