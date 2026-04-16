import express from "express";
import dotenv from 'dotenv';
dotenv.config();
import connectDb from "./db/connectDb";
import docRouter from "./routes/document.router";

const app = express();

app.use([express.json(), express.urlencoded({ extended: true })]);


// Routes
app.use("/api/v1", docRouter);






const PORT = process.env.PORT || 5000;

function startServer() {
  try {
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });
    connectDb().then(() => {
      console.log("Connected to MongoDB");
    })
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

startServer();