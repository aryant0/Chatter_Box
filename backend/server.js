import express from "express";
import dotenv from "dotenv"

import authRoutes from "./routes/auth.route.js"
import connectToMongoDB from "./db/connecToMongoDB.js";
const app = express();
dotenv.config();

const PORT = process.env.PORT
app.use(express.json())
app.use("/api/auth",authRoutes)

app.listen(PORT,() => {

    connectToMongoDB()
    console.log(`server is running on port ${PORT}`)
})