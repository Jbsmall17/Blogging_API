const joi = require("joi");
const {logger} = require("../../logger")

async function validateBlog(req,res,next){
    try{
        const schema =  joi.object({
            title : joi.string().required(),
            // state : joi.string().valid('draft', 'publish'),
            body : joi.string().required(),
            tag : joi.string().required()
        })
        
        await schema.validateAsync(req.body,{ abortEarly: true })
        next()
    }catch(error){
        return res.status(422).json({
            message: error.message,
            success: false
        })
    }
}


module.exports = {
    validateBlog
}