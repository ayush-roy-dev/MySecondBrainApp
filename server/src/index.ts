import dotenv from "dotenv"
dotenv.config()
import "express-async-errors"
import express from "express"
const app = express()


import { connectDB } from "./db/db"
import authRouter from "./routers/authRouter"
import contentRouter from "./routers/contentRouter"

// stock middlewares
app.use([express.json(), express.urlencoded()]);


// routers
app.use("/api/v1", authRouter)
app.use("/api/v1", contentRouter)



app.post("/api/v1/brain/share", (req, res) => {
    
})

app.get("/api/v1/brain/:shareLink", (req, res) => {
    
})

const port = process.env.PORT || 3000
const start = async () => {
    try {
        await connectDB(process.env.DB_URL).then(() => console.log(`Succesfully connected to DB....`))
        app.listen(port, () => console.log(`Server is listening on post ${port}.....`))
    } catch (error) {
        console.log(error)
    }
}

start()