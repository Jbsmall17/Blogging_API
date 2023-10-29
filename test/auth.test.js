const supertest = require("supertest");
const app = require('../api');
const {connect,disconnect,cleardata} = require("./database")
const usersModel = require("../models/users")

// Pass supertest agent for each test
const request = supertest.agent(app);


describe("Authentication Tests", ()=>{
    // test cases
    beforeAll(connect)
    beforeEach(cleardata)
    afterAll(disconnect)

    it("should register user successfully", async()=>{

        const response = await request
        .post("/signup")
        .set("content-type","application/json")
        .send({
            email : "jibolaee@gmail.com",
            first_name : "Abdulee",
            last_name : "Alao",
            password: "12345345"  
        })

        // expectation

        expect(response.status).toEqual(201);
        expect(response.body.message).toBe("user created successfully")
    })

    it('should successfully login a user', async () => {
        await usersModel.create({
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

        // expectations
        expect(response.status).toEqual(200);
        expect(response.body).toMatchObject({
            message: 'Logged in Successfully',
            token: expect.any(String)
        })
    })
})
