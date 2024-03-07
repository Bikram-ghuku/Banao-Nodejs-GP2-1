import express, {Request, Response} from "express"
import prisma from "../services/db"
import bcrypt from "bcrypt"



const register = async (req: Request, res: Response) => {
    type user = {uname: string, Pswd: string, email: string};
    const data: user = req.body;
    try{
        const enc_pass = await bcrypt.hash(data.Pswd, 10);
        const newUser = await prisma.user.create({
            data: {
                userName: data.uname,
                pswd: enc_pass,
                email: data.email
            }
        })
        res.status(200).send("Created user")
    }catch(error){
        console.log("Error: ", error);
        res.status(500).send(`Internal Server Error: ${error}`)
    }

}

const login = async (req: Request, res: Response) => {
    type loginUser = {pswd: string, uname: string} 
    const data: loginUser= req.body;
    if(data.uname && data.pswd){
        try{
            const findUser = await prisma.user.findUnique({
                where:{
                    userName: data.uname
                }
            })
            if(findUser){
                const isMatch = await bcrypt.compare(findUser.pswd, data.pswd)
                if(isMatch){
                    return res.status(200).send("Login successful")
                }else{
                    return res.status(401).send("Username or Password incorrect")
                }
            }else{
                return res.status(401).send("Please register first")
            }
        }catch(error){
            res.status(500).send(`Internal server Error: ${error}`)
        }
    }else{
        res.status(401).send("Username or password cannot be empty")
    }
}