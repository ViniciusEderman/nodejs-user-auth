# User Authentication
    API User Management System

# Table of Contents
    Introduction
    Installation
    Usage
    Endpoints
    Dependencies

# Introduction
    This project is an API-based user management system built with Node.js and Express.js. It provides endpoints to register new users, authenticate them using JSON Web Tokens (JWT), update user information, delete users, and retrieve user details if authenticated. The API interacts with a MySQL database using Sequelize as the ORM.

# Installation
    To get the API up and running on your local machine, follow these steps:

    Clone the repository:
    ```bash
    git clone https://github.com/ViniciusEderman/nodejs-user-auth
    ```

    Install the dependencies:
    ```bash
    npm install
    ```

    Set up your environment variables:
    Create a .env file in the root of the project and add the following
    ```bash
    JWT_SECRET=your_jwt_secret_key_here
    ```

    Start the server: -> The server will start running on http://localhost:8080.
    ```bash
    npm start
    ```
    Testing the API: You can use tools like Postman or curl to test the API endpoints. Refer to the Endpoints section for available endpoints and their usage.

# Endpoints
    The API exposes the following endpoints:
    **GET /: Get a welcome message and user details if authenticated.
      POST /register: Register a new user.
      POST /login: Log in a user and get a JWT.
      PUT /update/user/:id: Update user details by ID.
      DELETE /:id: Delete a user by ID.**

# Dependencies
    The project relies on several libraries, including bcryptjs, dotenv, express, jsonwebtoken, mysql2, and sequelize. For a complete list of dependencies and their versions, please write the **package.json**