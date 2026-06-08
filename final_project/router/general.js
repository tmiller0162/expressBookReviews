const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password)
    return res.status(400).send("Missing username or password");
  for (const user in users) {
    if (username == users[user]["username"])
      return res.status(400).send("Username not available");
  }
  users.push({"username": username, "password": password});
  return res.send("Registration successful");
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.send(JSON.stringify(books), null, 10);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const userISBN = req.params.isbn;
  if (!books[userISBN]) return res.status(404).send("Book not found");
  return res.send(JSON.stringify(books[userISBN]));
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const userAuthor = req.params.author;
  var foundBooks = [];
  for (const book in books) {
    if (books[book]["author"] == userAuthor) {
      foundBooks.push(books[book]);
    }
  }
  if (foundBooks.length == 0) return res.status(404).send("Book not found");
  res.send(foundsBook);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const userTitle = req.params.title;
  var foundBook;
  for (const book in books) {
    if (books[book]["title"] == userTitle) {
      foundBook = books[book];
    }
  }
  if (!foundBook) return res.status(404).send("Book not found");
  res.send(foundBook);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const userISBN = req.params.isbn;
  if (!books[userISBN]) return res.status(404).send("Book not found");
  const reviews = books[userISBN]["reviews"];
  return res.send(JSON.stringify(reviews));
});

module.exports.general = public_users;
