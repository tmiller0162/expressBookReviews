const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username, password) => {
  let validUsers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  return validUsers.length > 0;
  //TODO: validUsers should never be >1.
};

const authenticatedUser = (username, password) => {};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) return res.status(400).send("Error during login");
  if (!isValid(username, password))
    return res.status(400).send("Failed to authenticate");
  let accessToken = jwt.sign(
    {
      data: password,
    },
    "access",
    { expiresIn: 60 * 60 },
  );

  req.session.authorization = {
    accessToken,
    username,
  };
  return res.send("Login successful.");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const userReview = req.body.review;
  const userISBN = req.params.isbn;
  const username = req.user.data;
  if (!userReview) return res.send("Error processing review");

  books[userISBN]["reviews"][username] = userReview;
  return res.send("Review added");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
