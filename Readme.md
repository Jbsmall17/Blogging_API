# Blogging API Documentation

## Introduction

The Blogging API is designed to allow users to create, manage, and share blog posts. This API provides various endpoints and features for user management, authentication, and blog post operations.

General Endpoint : http://localhost:4000   (local)

## How to get All get blogs
- this is an unprotected route open to everyone(user and none users)
- Blogs are paginated : a total od 20 post per page
- Blogs can be searched by author, title, and tag.
- Blogs can be ordered by read count, reading time, and timestamp.

**HTTP Method:** `GET`
**URL:** `/`

**request**
-**query**
    -author: a string  (optional)
    -title:  a string  (optional)
    -tag :  a string  (optional)
    -order: this could a value of either read_count, reading_time, and timestamp.





## Authentication

### JWT Authentication

- To have access to, to certain functionalities user must sign up anf obtain a jwt
- jwt expires in an hour

### User Registration

Endpoint: user signup

**HTTP Method:** `POST`
**URL:** `/signup`


**Description:**
Create a new user.


**Request:**

- **Body:**
  ```json
  {
    "email" : "johndoe@gmail.com",
    "password" : "anypasswordofyourchoice",
    "first_name" : "john",
    "last_name" : "doe"
  }

**Request:**
status code : 201


{
    "message": "user created successfully",
    "data": {
        "email": "johndoe@gmail.com",
        "first_name": "john",
        "last_name": "doe",
        "password": "$2b$10$.CLvV.ozUJhZR37ga7ZSPOClFO44xDUcBLSCQT654o0HExHy0kZsm",
        "created_at": "2023-10-29T09:23:43.475Z",
        "user_type": "user",
        "_id": "l-fWPfGOo",
        "__v": 0
    }
}


### User Sign-In

- Registered users can sign in with their email and password to obtain a JWT.

Endpoint: user signup

**HTTP Method:** `POST`
**URL:** `/login`


**Description:**
login a user.


**Request:**

- **Body:**
  ```json
  {
    "email" : "johndoe@gmail.com",
    "password" : "anypasswordofyourchoice",
  }

**Request:**
status code : 200
-** your resonpse will be similar to this **

{
    "message": "Logged in Successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6InRwT3g0Z29WdSIsImVtYWlsIjoiYWxhb2FiZHVsQGdtYWlsLmNvbSIsImxhc3RfbmFtZSI6ImFyYW1pZGUifSwiaWF0IjoxNjk4NTcyODUzLCJleHAiOjE2OTg1NzY0NTN9.tibyF4c8SgBClUxUFtXXoh-nuYQvaTuH47h9HcMgOAg"
}



### Blog States

- Blogs can be in two states: draft and published.
- New blogs are created in the draft state.
- Blog owners can update the state to published.


### Creating a Blog

- Only Authenticated users can create a blog.

Endpoint: Create a Blog

**HTTP Method:** `POST`
**URL:** `/blog`

**Description:**
Create a new blog post.

**Request:**

- **Headers:**
  - `Authorization`: Bearer JWT Token (for authentication)


- **Body:**
Accepted tags: sport, technology, science and politics
tilte format : <tag>-news (for examplse : sport-news, tech-news, science-news, politics-news) 

  ```json
  {
    "title" : "sport-news",
    "body" : "sport! sport!! sport!!! sport!!!! sport!!!!!",
    "tag" : "sport"
  }

**Response**
status code 200
-** your resonpse will be similar to this **
{
    "message": "blog created successfully",
    "data": {
        "title": "sport-news",
        "author": "aramide",
        "body": "sport! sport!! sport!!! sport!!!! sport!!!!!",
        "user_id": "tpOx4goVu",
        "state": "draft",
        "read_count": 0,
        "reading_time": 1333.3333333333335,
        "tag": "sport",
        "timeStamp": "2023-10-29T02:36:36.382Z",
        "_id": "9OubcVKDY",
        "__v": 0
    }
}


### Updating a Blog

- The owner of a blog can update the state of  its content,.
- Blog state can be changed from draft to published by the owner.

Endpoint: update a blog



**HTTP Method:** `PATCH`
**URL:** `/blog/:id`

**Description:**
update a blog post.

**Request**

- **Params:**
  - `id`: value of _id of a blog post

- **Headers:**
  - `Authorization`: Bearer JWT Token (for authentication)

- **Body:**
  -body not required


**Response**
your response will be similar to this

{
    "message": "updated successfully",
    "data": {
        "_id": "9OubcVKDY",
        "title": "sport-news",
        "author": "aramide",
        "body": "sport! sport!! sport!!! sport!!!! sport!!!!!",
        "user_id": "tpOx4goVu",
        "state": "publish",
        "read_count": 0,
        "reading_time": 1333.3333333333335,
        "tag": "sport",
        "timeStamp": "2023-10-29T02:36:36.382Z",
        "__v": 0
    }
}


### list all blogs of the user

- only user can perform this function 
- response is paginated
- it can filterable by state: draft or published

**HTTP Method:** `GET`
**URL:** `/blog`

**Request**

- **query**
    -page: takes a digit (optional)
    -limit: take a digit (optional)
    -state : it could either be draft or publish 

how the url look like when all query are applied

**URL:** `/blog?page=1&limit=5&state=draft`



### get a blog of a user

**HTTP Method:** `GET`
**URL:** `/blog/:id`

**Request**

- **params**
    id : value of _id of one the users blog 



