import express, {Request, Response} from "express"
import prisma from "../services/db"
import bcrypt from "bcrypt"



const register = async (req: Request, res: Response) => {
    type user = {uname: string, pswd: string, email: string};
    try{
        const data: user = req.body;
        const enc_pass = await bcrypt.hash(data.pswd, 0);
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
    var data: loginUser = {pswd: "", uname: ""}
    try{
        data = req.body;
    }catch(error){
        res.status(500).send(`Internal Server Error ${error}`)
    }
    if(data.uname && data.pswd){
        try{
            const findUser = await prisma.user.findUnique({
                where:{
                    userName: data.uname
                }
            })
            if(findUser){
                const isMatch = await bcrypt.compare(data.pswd, findUser.pswd)
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

export {register, login}