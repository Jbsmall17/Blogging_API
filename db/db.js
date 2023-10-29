const mongoose = require('mongoose')
require("dotenv").config()

const MONGODB_URL = process.env.MONGODB_URL

async function connectToDb(){
    mongoose.connect(MONGODB_URL)

    mongoose.connection.on("connected",()=>{
        console.log("connected successfully")
    })

    mongoose.connection.on("error",()=>{
        console.log("unable to connect")
    })
}


module.exports = {connectToDb}