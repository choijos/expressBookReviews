const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const JWT_SECRET = require('../config.js');

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid (if there is a user with this uname)
  let user = users.filter((u) => {
    return u["username"] === username}
  );

  if (user.length < 1) {
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
  let accessToken = jwt.sign({ data: pwd }, JWT_SECRET, { expiresIn: 60 * 60 });
  req.session.authorization = {accessToken, uname};
  return res.status(200).send("User has successfully logged in.");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  /* 
    Complete the code for adding or modifying a book review.
    Hint: You have to give a review as a request query & it must get posted with the username
    (stored in the session) posted. If the same user posts a different review on the same ISBN,
    it should modify the existing review. If another user logs in and posts a review on the same ISBN,
    it will get added as a different review under the same ISBN.
    
    review: {
      "username": [review],
      "username": [review],
      ...
    }

    * could be better to have a uid for each user so we don't have to store by username but mb another time
  */
  let review = req.query.review; // check
  let username = req.session.authorization.uname;

  let book = books[req.params.isbn];
  if (!book) {
    return res.status(403).send(`There is no book with isbn: ${req.params.isbn}`);
  }

  let message = "";
  if (Object.keys(book["reviews"]).includes(username)) {
    // want to modify review
    // delete book["reviews"][usernmae];
    delete books[req.params.isbn]["reviews"][username];
    message = "Your review for this book has been modified.";
  } else {
    message = "Your review for this book has been added.";

  }

  books[req.params.isbn]["reviews"][username] = review;
  res.status(200).send(message);

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  /*
    Hint: Filter & delete the reviews based on the session username,
    so that a user can delete only his/her reviews and not other users’.
  */
  let username = req.session.authorization.uname;
  let book = books[req.params.isbn];
  if (!book) {
    return res.status(403).send(`There is no book with isbn: ${req.params.isbn}`);
  }

  if (Object.keys(book["reviews"]).includes(username)) {
    delete books[req.params.isbn]["reviews"][username];
    return res.status(200).send("Your review for this book has been deleted.");
  }

  return res.status(403).send("You have not yet reviewed this book.");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
