const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const BlogModel = require("../../models/blog")
const {logger} = require("../../logger")
// const blogServices = require("./blog.services")
require("dotenv").config()

function estimateReadingTime(text) {
    const wordsPerMinute = 225; 
  
    const wordCount = text.split(/\s+/).length;
  

    const readingTimeInMinutes = wordCount / wordsPerMinute;
    const readingTimeInMilliseconds = readingTimeInMinutes * 60 * 1000;
  
    return readingTimeInMilliseconds;
  }

async function createBlog(req,res,next){
    try{
    const blogPost = req.body
    const token = req.headers.authorization.split(" ")[1];
    const tokenSecret = process.env.JWT_SECRET
    const userDetials = jwt.verify(token,tokenSecret);
    const {_id,last_name} = userDetials.user
    const {body} = blogPost
    blogPost.user_id = _id
    blogPost.author = last_name
    blogPost.state = "draft"
    blogPost.reading_time = await estimateReadingTime(body)
    // console.log(blogPost)
    const createPost = await BlogModel.create({
        title : blogPost.title,
        author : blogPost.author,
        body : blogPost.body,
        user_id : blogPost.user_id,
        state : blogPost.state,
        tag: blogPost.tag,
        reading_time : blogPost.reading_time 
    })
    logger.log("info", "blog created successfully")
    res.status(201).json({
        message : "blog created successfully",
        data : createPost
    })
    }catch(error){
        logger.log("error",  "Bad request")
        return res.status(500).json({
            message : "server error",
            data: null
        })
    }
}

async function getBlogs(req,res,next){
    try{
        const page = parseInt(req.query.page) ||1;
        const limit = parseInt(req.query.limit) || 5;
        const state = req.query.state;
        console.log(state)
        const skip = (page - 1) * limit
        const token = req.headers.authorization.split(" ")[1];
        const JWT_SECRET = process.env.JWT_SECRET
        const userDetials = jwt.verify(token,JWT_SECRET)

        const {_id} = userDetials.user
        let userBlogs;
        if(page && limit){
            if(state){
            userBlogs = await BlogModel.find({
                user_id : _id,
                state : state
            }).skip(skip).limit(limit)
            }else{
                userBlogs = await BlogModel.find({
                    user_id : _id,
                }).skip(skip).limit(limit)
            }
            logger.log("info", "Successfully retrieved blogs.")
            return  res.status(200).json({
                message : "Successfully retrieved blogs.",
                data: userBlogs         
            })
        }
    }catch(error){
        logger.log("error", "Bad request")
        res.status(400).json({
            message : "Bad request",
            data : null
        })
    }
}

async function getBlog(req,res,next){
    try{
        const id = req.params.id;
        const token = req.headers.authorization.split(" ")[1];
        const JWT_SECRET = process.env.JWT_SECRET
        const userDetials = jwt.verify(token,JWT_SECRET)

        const {_id} = userDetials.user
        const blog =  await BlogModel.findOne({
            _id : id,
            user_id : _id 
        })

        if(!blog){
            logger.log("error", "blog not found")
            return res.status(404).json({
                message : "blog not found",
                data : null
            })
        }
        else{
            logger.log("info", "blog successfully retreived")
            return res.status(200).json({
            message : "blog successfully retreived",
            data : blog
        })
    }
    }
    catch(error){
        logger.log("error", "Bad request")
        return res.status(400).json({
            message : "Bad request",
            data : null
        }) 
    }
}

async function updateBlog(req,res,next){
    try{
        const id = req.params.id
        const token = req.headers.authorization.split(" ")[1];
        const JWT_SECRET = process.env.JWT_SECRET
        const userDetials = jwt.verify(token,JWT_SECRET)  
    
        const {_id} = userDetials.user

        const user = await BlogModel.findOne({
            _id : id,
            state : "publish" 
        })
        if(user){
            logger.log("error", "article/blog already updated(publish)")
            return res.status(400).json({
                message : "article/blog already updated(publish)",
                data : user
            })
        }

        const conditions = {
            _id : id,
            user_id : _id 
        }

        const update = {
            $set: {
              state : "publish"
            },
          }
        
        const publishPost = await BlogModel.findOneAndUpdate(
            conditions,
            update,
            {new : true}    
        )
        logger.log("info", "updated successfully")
        return res.status(200).json({
            message : "updated successfully",
            data : publishPost
        })

    }catch(error){
        logger.log("error", "Bad Request")
        res.status(400).json({
            message : "Bad Request",
            data : null
        })
    }

}

async function editBlog(req,res,next){
    try{
        const newDetails = req.body
        const id = req.params.id
        const token = req.headers.authorization.split(" ")[1];
        const JWT_SECRET = process.env.JWT_SECRET
        const userDetials = jwt.verify(token,JWT_SECRET)  
    
        const {_id} = userDetials.user

        const conditions = {
            _id : id,
            user_id : _id 
        }

        const update = {
            $set: {
              ...newDetails
            }
        }

        const newBlog = await BlogModel.findOneAndUpdate(
            conditions,
            update,
            {new : true}    
        )
        
        logger.log("info","blog editted successfully")
        return res.status(200).json({
           message : "blog editted successfully",
           data :  newBlog
        })

    }
    catch(error){
        logger.log("error","bad request")
        res.status(400).json({
           message : "bad request",
           data : null 
        })
    }
}

async function deleteBlog(req,res,next){
    try{
    const id = req.params.id
    const token = req.headers.authorization.split(" ")[1];
    const JWT_SECRET = process.env.JWT_SECRET
    const userDetials = jwt.verify(token,JWT_SECRET)  
    
    const {_id} = userDetials.user

    const conditions = {
        _id : id,
        user_id : _id 
    }
    // console.log(conditions)
        const deletedBlog = await BlogModel.findOneAndDelete(conditions) 
        
        logger.log("info", "deleted successfully")
        return res.status(200).json({
            message : "deleted successfully",
            data : deletedBlog
        })
    }catch(error){
        logger.log("error", "Bad Request")
        res.status(400).json({
            message : "Bad Request",
            data : null
        })
    }
}

module.exports = {
    createBlog,
    getBlogs,
    getBlog,
    editBlog,
    updateBlog,
    deleteBlog
}