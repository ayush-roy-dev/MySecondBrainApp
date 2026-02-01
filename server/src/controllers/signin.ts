import { Controller } from "../types"

const signin: Controller = (req, res) => {
    res.json({"msg": "signin"})
}

export default signin