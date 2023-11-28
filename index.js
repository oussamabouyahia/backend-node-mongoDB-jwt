const express = require("express");
const app = express();
require("dotenv").config();
const db = require("./db/dbConnect");
const userController = require("./controllers/userController");
var morgan = require("morgan");

// morgan combined middleware used  to console log the method, timestamp and the path of the request
app.use(morgan("combined"));
app.use(express.json());

// error handling using custom middleware
app.use(require("./middelwares/customErrorMiddelware").customErrorMiddelware); // see middelware folder
//auth middelware currently not used but working if needed to be implemented in any route
const auth = require("./middelwares/authorization").authorization; // see middelware folder
// CRUD OPERATIONS
//Read Operation: users List
app.get("/users", userController.listOfUsers); // see listOfUsers from controllers/userController
//Read Operation: find one user
app.get("/users/:id", userController.getUserById); // see getUserById from controllers/userController
//Create operation: add a new user
app.post("/register", userController.register); //see register from controllers/userController
//Update operation : update a user by id
app.put("/users/:id", userController.updateUser); //see updateUser from controllers/userController
// Delete Operation: delete a user by id
app.delete("/users/:id", userController.deleteUser); //see deleteUser from controllers/userController
//login
app.post("/login", userController.login); //see login from controllers/userController
app.listen(3000, () => {
  console.log("server is listenning on port 3000");
  db();
});
