const express = require("express")
const db = require("./db/db")
const passport = require("passport")
const authRouter = require("./routes/auth")
const blogRouter = require("./routes/blog/blog")
const BlogModel = require("./models/blog")
require("dotenv").config()
require("./authenticate/auth")


const PORT = process.env.PORT || 4000

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended : true}))
// db.connectToDb() // connect to mongo db


app.use("/", authRouter)
app.use("/blog", passport.authenticate('jwt', { session: false }), blogRouter)


// get all blog posts/articles
app.get("/",async(req,res)=>{
    try{
    const page = req.query.page || 1;
    const author = req.query.author;
    const title = req.query.title;
    const tag = req.query.tag;
    // order : read_count, reading_time and timestamp
    const order= req.query.order || "timeStamp";
    const limit = 20;
    const skip = (page - 1) * limit;
    let blogArticleArray
    if(page && limit){
        if(author){
            blogArticleArray = await BlogModel.find({
                author : author,
                state : "publish"
            }).skip(skip).limit(20).sort(order)
        }else if(title){
            blogArticleArray = await BlogModel.find({
            title : title,
            state : "publish"
            }).skip(skip).limit(20).sort(order)
        }else if(tag){
            blogArticleArray = await BlogModel.find({
            tag : tag,
            state : "publish"
            }).skip(skip).limit(20).sort(order)
        }
        else{
            blogArticleArray = await BlogModel.find({
                state : "publish"
                }).skip(skip).limit(20).sort(order)
        }
        return res.status(200).json({
            message : "blog articles successfully retrieved",
            data : blogArticleArray      
        })
        }
    // else{
    //     return res.status(404).json({
    //         message : "search api by either author,title or tag and order outcome by either read_count,reading_time and timestamp",
    //         data : null
    //     })
    // }
    }catch(error){
        return res.status(400).json({
            message : "bad request",
            data: null
        })
    }
})


// get a single blog
app.get("/:id",async(req,res)=>{
    try{
        const id = req.params.id;

        const singleBlogPost = await BlogModel.findOne({
            _id : id,
            state: "publish"
        }) 
        if(!singleBlogPost){
            return res.status(404).json({
                message : "Article not found",
                data : null
            })
        }

        const read_Count_obj = {
            read_count : singleBlogPost.read_count + 1
        }

        const updatedBlogPost = await BlogModel.findByIdAndUpdate(
            id, read_Count_obj, {new: true}
            )
        return res.status(200).json({
            message : "blog successfully retrieved",
            data : updatedBlogPost
        })
    }catch(error){
        return res.status(400).json({
            message : "Bad request",
            data : null          
        })
    }
    
})


// global error middlewares

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({
        data: null,
        error: 'Server Error occured'
    })
})

// app.listen(PORT,()=>{
//     console.log(`localhost:${PORT}`)
// })


module.exports = app