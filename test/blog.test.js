const supertest = require('supertest')
const app = require("../api")
const userModel = require("../models/users")
const blogModel = require("../models/blog")
const {disconnect,connect, cleardata} = require("./database")
// const { createUserAndSignUp } = require("./test.services")


const request = supertest(app)


describe("Blog endpoint test", ()=>{
    
    beforeAll(connect)
    beforeEach(cleardata)
    afterAll(disconnect)

    it("should test the postBlog endpoint", async()=>{

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

        const response2 = await request
        .post("/blog")
        .set("Authorization", `Bearer ${response.body.token}`)
        .send({
            title : "sport news",
            body : "arsenal won 5 nil today",
            tag : "sport"
        })        

        expect(response2.status).toEqual(201)
        expect(response2.body).toMatchObject({
            message: 'blog created successfully',
            data: expect.any(Object)
        })
    })

    it("should test the postBlog endpoint, when the payload is not correct", async()=>{

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

        const response2 = await request
        .post("/blog")
        .set("Authorization", `Bearer ${response.body.token}`)
        .send({
            title : "sport news",
            body : "arsenal won 5 nil today"
        })        

        expect(response2.status).toEqual(422)
        expect(response2.body).toMatchObject({
            message: expect.any(String),
            success : false
        })
    })

    
    it("should test getblog endpoint successfully", async()=>{
        // create user
        await userModel.create({
            email : "jibolaee@gmail.com",
            first_name : "Abdulee",
            last_name : "Alao",
            password: "12345345"  
        });

        // login user
        const response = await request
        .post('/login')
        .set('content-type', 'application/json')
        .send({
            email : "jibolaee@gmail.com",
            password: "12345345" 
        })

        // get post

        const response2 = await request
        .get("/blog?state=draft")
        .set("Authorization", `Bearer ${response.body.token}`)
        
        
        expect(response2.body.message).toBe("Successfully retrieved blogs.")
    })

    it("should test updateBlog endpoint successfully", async()=>{
        
        // create user
        const user =  await userModel.create({
            email : "jibolaee@gmail.com",
            first_name : "Abdulee",
            last_name : "Alao",
            password: "12345345"  
        });
        
        const {_id} = user

        // login user
        const response = await request
        .post('/login')
        .set('content-type', 'application/json')
        .send({
            email : "jibolaee@gmail.com",
            password: "12345345" 
        })

        const response2 = await request
        .patch(`/blog/${_id}`)
        .set("Authorization", `Bearer ${response.body.token}`)
        

        expect(response2.body).toMatchObject({
            message : "updated successfully",
            data : expect.any(Object)
        })
    })

    it("should test deleteBlog endpoint successfully", async()=>{
         // create user
         const user =  await userModel.create({
            email : "jibolaee@gmail.com",
            first_name : "Abdulee",
            last_name : "Alao",
            password: "12345345"  
        });

        const {_id} = user

        // login user
        const response = await request
        .post('/login')
        .set('content-type', 'application/json')
        .send({
            email : "jibolaee@gmail.com",
            password: "12345345" 
        })

        // delete a blog
        const response2 = await request
        .delete(`/blog/${_id}`)
        .set("Authorization", `Bearer ${response.body.token}`)

        // expectation
        expect(response2.body).toMatchObject({
            message : "deleted successfully",
            data : expect.any(Object)
        })

    })

})