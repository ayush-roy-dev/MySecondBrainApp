import Content from "../models/Content"
import { Controller } from "../types"

export const getContent: Controller = async (req, res) => {
    const userId = req.userId
    const content = await Content.find({userId}).populate("userId", "username")

    res.json({ content })
}

export const postContent: Controller = async (req, res) => {
    const userId = req.userId
    const {link, type, title} = req.body

    await Content.create({
        title,
        link,
        type,
        userId,
        tags: []
    })

    res.json({"msg": "Content uploaded"})

}

export const deleteContent: Controller = async (req, res) => {
    const userId = req.userId
    const contentId = req.body.contentId

    await Content.deleteOne({_id: contentId, userId})

    res.json({"msg": "Content deleted"})

}