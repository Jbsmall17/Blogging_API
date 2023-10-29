const express = require("express");
const jwt = require("jsonwebtoken")
const UserModel = require("../models/users")
const passport = require("passport")
const {logger} = require("../logger")
require("dotenv").config()



const JWT_SECRET = process.env.JWT_SECRET

const authRouter = express.Router()

authRouter.post(
    "/signup",
    async(req,res,next)=>{
        passport.authenticate("signup",
        async (err,email,password)=>{
            if(err){
                logger.log('error', "error creating user")
                return res.status(500).json({
                    message : "error creating user"
                })
            }

            if(err == null && email == false){
                logger.log('error', "User Already exist")
                return res.status(400).json({
                    message : "User Already exist"
                })
            }   
            const {first_name, last_name} = req.body
            // console.log(email,password, first_name, last_name)
        
            const user = await UserModel.create({email,password, first_name, last_name}) 

            if(!user){
                logger.log('error', "user creation failed")
                return res.status(400).json({
                    message : "user creation failed"
                })
            }
            logger.log('info', "user created successfully")
            return res.status(201).json({
                message : "user created successfully",
                data : user
            })
        }
        )(req,res,next)
    }
    )


authRouter.post(
    "/login",
    async(req,res,next)=>{
        passport.authenticate(
        "login",
        async(err,user,info)=>{
          if(err){
            logger.log('error', "server error")
            return res.status(500).json({
                message : "server Error",
                data: null
            })
          }
        if(!user){
            logger.log('error', "invalid email or password")
            return res.status(400).json({
                message : info.message,
                data: null
            })
        }
            
           req.login(user, {session: false},
            
            async (error) => {
                if (error) return next(error);
                
                const body = { 
                    _id: user._id, 
                    email: user.email, 
                    first_name: user.fisrt_name, 
                    last_name: user.last_name 
                };

                const token = jwt.sign(
                    { user: body }, 
                    JWT_SECRET, 
                    { expiresIn: '1h' }
                    );
                logger.log('info', "user logs in successfully")
                return res.status(200).json(
                    { message : info.message,
                        token 
                    }
                    );
        
        }
        )
    }
    )(req,res,next)
}
)

module.exports = authRouter