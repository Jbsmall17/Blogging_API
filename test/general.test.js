const supertest = require("supertest")
const userModel = require("../models/users")
const blogModel = require("../models/blog")
const {connect,cleardata,disconnect} = require("./database")
const app = require("../api")


const request = supertest.agent(app)


describe("general(unprotected)endpoint test",()=>{

    beforeAll(connect)
    beforeEach(cleardata)
    afterAll(disconnect)
    
    it("get all blog posts/articles endpoint test", async()=>{
        
        // get all articles
        const response = await request
        .get("/")

        // expectation

        expect(response.body).toMatchObject({
            message : "blog articles successfully retrieved",
            data : expect.any(Object)
        })

        expect(response.status).toBe(200)
    })

    it("it should return a single article",async()=>{
        
        const user = await userModel.create({
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
        
        // create an article 
        const response2 = await request
            .post("/blog")
            .set("Authorization", `Bearer ${response.body.token}`)
            .send({
                title : "sport news",
                body : "arsenal won 5 nil today",
                tag : "sport"
            })   
        
        // update an article
        const response4 = await request
        .patch(`/blog/${response2.body.data._id}`)
        .set("Authorization", `Bearer ${response.body.token}`)

        // get a articles

        const response3 = await request
        .get(`/${response2.body.data._id}`)

        expect(response3.body).toMatchObject({
            message : "blog successfully retrieved",
            data : expect.any(Object)
        })

    })

})
