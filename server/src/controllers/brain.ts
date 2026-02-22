import Content from "../models/Content";
import Link from "../models/Link";
import User from "../models/User";
import { Controller } from "../types";
import { random } from "../utils";

export const shareBrain: Controller = async (req, res) => {
    const share = req.body.share;
    let hash;
    if (share) {
        hash = random(10)
        await Link.create({
            userId: req.userId,
            hash
        })
        res.json({hash})
    } else {
        await Link.deleteOne({userId: req.userId})
        res.json({msg: "No share"})
    }  

}

export const accessBrain: Controller = async (req, res) => {
    const hash = req.params.shareLink
    const link = await Link.findOne({hash})

    if (!link) {
        res.status(411).json({msg: "Sorry incorrect input"})
        return
    }
    const content = await Content.find({userId: link.userId})
    const user = await User.findOne({_id: link.userId})
    if (!user) {
        res.status(411).json({msg: "User not found internal db error"})
        return
    }
    

    res.json({
        username: user.username,
        content: content
    })
}