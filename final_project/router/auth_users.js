const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid (if there is a user with this uname)
  let user = users.filter((u) => u["username"] === username);
  if (user.length < 0) {
    return true;
  }

  return false;
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  let user = users.filter((u) => u["username"] === username && u["password"] === password);
  if (user.length < 1) {
    return false;
  }

  return true;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  /*
    The code must validate and sign in a customer based on the username and password created
    in Exercise 6. It must also save the user credentials for the session as a JWT.
    As you are required to login as a customer, while testing the output on Postman,
    use the endpoint as "customer/login"
  */
  let uname = req.body.username;
  let pwd = req.body.password;
  if (!uname && !pwd) {
    return res.status(403).send("Please provide a username and password.");
  } else if (!uname) {
    return res.status(403).send("Please provide a username.");
  } else if (!pwd) {
    return res.status(403).send("Please provide a password.");
  }

  if (!authenticatedUser(uname, pwd)) {
    return res.status(403).send("Incorrect login information provided.");
  }

  // create access token
  let accessToken = jwt.sign({ data: pwd }, "access", { expiresIn: 60 * 60 });
  req.session.authorization = {accessToken, uname};
  return res.status(200).send("User has successfully logged in.");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
