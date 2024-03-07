import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config()

const app : Express = express()

const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.status(200).send("Hello there")
})

app.listen(PORT, () => {
    console.log("Server listening on: ", PORT)
})