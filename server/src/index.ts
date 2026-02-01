import dotenv from "dotenv"
dotenv.config()
import express from "express"
const app = express()


import { connectDB } from "./db/db"
import authRouter from "./routers/authRouter"



app.use("/api/v1", authRouter)

app.post("/api/v1/content", (req, res) => {
    
})

app.get("/api/v1/content", (req, res) => {
    
})

app.delete("/api/v1/content", (req, res) => {
    
})

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