# Task Manager

A simple Task Manager application built with Node.js and Express to manage tasks efficiently.

## Features

- Create, update, delete, and retrieve tasks
- MongoDB for data storage (if applicable)
- JWT Authentication

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (>= v14)
- [MongoDB](https://www.mongodb.com/) (if using a database)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/tejasprajapati2846/Task-Manager-Node-js.git
   cd Task-Manager-Node-js
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add necessary environment variables:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/taskmanager
   JWT_SECRET=your_secret_key
   ```

## Running the Project

### Using Node.js

Start the server with:
   ```sh
   npm start
   ```

### Using Nodemon (for development)

   ```sh
   npm run dev
   ```

## Contributing

Feel free to submit issues or pull requests.

