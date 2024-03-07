import {Request, Response} from "express"
import prisma from "../services/db"
import bcrypt from "bcrypt"
import axios from 'axios';

const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const register = async (req: Request, res: Response) => {
    type user = {uname: string, pswd: string, email: string};
    try{
        const data: user = req.body;
        if(!expression.test(data.email)) return res.status(403).send("Given email is not a proper email format")
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

const emailer = async (email: string, id: string) => {

    const response = await axios.post(
      'https://api.mailersend.com/v1/email',
      {
        'from': {
          'email': 'info@trial-yzkq340n070gd796.mlsender.net'
        },
        'to': [
          {
            'email': email
          }
        ],
        'subject': 'Hello from MailerSend!',
        'text': 'Greetings from the team, you got this message through MailerSend.',
        'html': 'Greetings from the team, you got this message through MailerSend.'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': `Bearer ${process.env.MAIL_API || ""}`
        }
      }
    );
    console.log(`Send email for ${id}`)
}

const forgotPswd = async (req: Request, res: Response) => {
    type forData = {uname: string, email: string}
    try{
        const user: forData = req.body
        const findUser = await prisma.user.findUnique({
            where:{
                userName: user.uname
            }
        })

        if(findUser && findUser.email == user.email){
            await emailer(user.email, findUser.id);
        }
        res.status(200).send("Email Sent Successfully")
    }catch(error){
        res.status(500).send(`Internal Server error ${error}`)
    }
}
export {register, login, forgotPswd}