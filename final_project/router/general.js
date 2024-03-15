const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let uname = req.body.username;
  let pwd = req.body.password;
  let message = "";

  // If the username already exists, it must mention the same & must also show other
  //  errors like eg. when username & password are not provided.
  if (!uname) {
    message += "\nPlease provide a username.";
  } else if (!isValid(uname)) {
    message += "\nThere is already a user with this username.";
  }

  if (!pwd) {
    message += "\nPlease provide a password.";
  }
  
  if (message.length > 1) { // errors, can't register
    return res.status(403).send(message);
  }

  // successful registration
  users.push({
    "username": uname,
    "password": pwd
  });

  return res.status(200).send("User has been successfully registered.");
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, " "));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) { // not sure if you have to parseInt() the param
  let book = books[req.params.isbn];
  if (!book) {
    return res.status(403).send(`There is no book with isbn number: ${req.params.isbn}`);
  }
  
  return res.status(200).send(JSON.stringify(book, null, " "));
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let auth = req.params.author;
  let bs = [];
  Object.values(books).forEach((book) => {
    if (auth.localeCompare(book["author"], undefined, { sensitivity: "base" }) == 0) {
      bs.push(book);
    }
  });

  if (bs.length < 1) {
    return res.status(403).send(`There are no books by the author: ${auth}`);

  }

  return res.status(200).send(JSON.stringify(bs));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  let bs = [];
  Object.values(books).forEach((book) => {
    if (title.localeCompare(book["title"], undefined, { sensitivity: "base" }) == 0) {
      bs.push(book);
    }
  });

  if (bs.length < 1) {
    return res.status(403).send(`There are no books with the title: ${title}`);

  }

  return res.status(200).send(JSON.stringify(bs));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let book = books[req.params.isbn];
  if (!book) {
    return res.status(403).send(`There is no book with isbn: ${req.params.isbn}`);
  }

  let reviews = book["reviews"];
  if (Object.keys(reviews).length < 1) {
    return res.status(403).send("There are no reviews for this book.");
  }
  
  return res.status(200).send(JSON.stringify(reviews));
});

module.exports.general = public_users;
