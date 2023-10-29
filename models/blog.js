const mongoose = require("mongoose")
const shortid = require("shortid")


const Schema = mongoose.Schema


const BlogSchema = new Schema({
    _id:{
        type: String,
        default : shortid.generate
    },
    title:{
        type: String,
        required : true
    },
    author:{
        type: String,
        required : true
    },
    body :{
        type: String,
        required: true
    },
    user_id:{
        type: String,
        require : true
    },
    state : {
        type: String,
        enum: ["draft", "publish"],
        default : "draft"
    },
    read_count :{
        type : Number,
        default: 0
    },
    reading_time : {
        type : Number,
        required : true
    },
    tag : {
        type : String,
        default : "blogpost"
    },
    timeStamp : {
        type : Date,
        default : new Date() 
    }
})


const BlogModel = mongoose.model("blogs", BlogSchema)

module.exports = BlogModel