const express = require("express")
const blogMiddlewares = require("./blog.middleware")
const blogController = require("./blog.contoller")
require("dotenv").config()

const blogRouter = express.Router();

// create a blog

blogRouter.post("/",
    blogMiddlewares.validateBlog,
    blogController.createBlog
)
// get blogs articles
blogRouter.get("/", blogController.getBlogs)

// get a blog/articles
blogRouter.get("/:id", blogController.getBlog)

// update blog articles

blogRouter.patch("/:id", blogController.updateBlog)

// delete a blog article

blogRouter.delete("/:id", blogController.deleteBlog)


module.exports = blogRouter