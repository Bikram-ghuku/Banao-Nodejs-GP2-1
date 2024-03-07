import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import router from "./routes/User";
import bodyParser from "body-parser"

dotenv.config()

const app : Express = express()

const PORT = process.env.PORT || 3000;
app.use(bodyParser.json())
app.use("/", router)

app.listen(PORT, () => {
    console.log("Server listening on: ", PORT)
})