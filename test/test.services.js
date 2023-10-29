const supertest = require("supertest")
const app = require("../api")
const userModel = require("../models/users")

const request = supertest(app)

async function createUserAndSignUp(){
    await userModel.create({
        email : "jibolaee@gmail.com",
        first_name : "Abdulee",
        last_name : "Alao",
        password: "12345345"  
    });

    const response = await request
    .post('/login')
    .set('content-type', 'application/json')
    .send({
        email : "jibolaee@gmail.com",
        password: "12345345" 
    })

    const token = response.body.token
    
    return token 
}


module.exports = {
    createUserAndSignUp
}