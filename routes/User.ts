import express from "express"
import { register, login, forgotPswd } from "../controller/Users"

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.post("/forgotPswd", forgotPswd)


export default router