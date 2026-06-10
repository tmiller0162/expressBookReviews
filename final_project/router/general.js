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

  let foundUsers = users.filter((user) => {
    return user.username === username;
  });
  if (foundUsers.length > 0)
    return res.status(400).send("User with that name already exists");
  users.push({ username: username, password: password });
  return res.send("Registration successful");
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  let promise = new Promise((resolve, reject) => {
    resolve(JSON.stringify(books), null, 4);
  });
  promise.then((response) => {
    return res.send(response);
  });
  //Would implement if Promise could fail
  //promise.catch()
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  let promise = new Promise((resolve, reject) => {
    const userISBN = req.params.isbn;
    if (!books[userISBN]) reject([404, "Book not found"]);
    resolve(JSON.stringify(books[userISBN]));
  });
  promise
    .then((response) => {
      return res.send(response);
    })
    .catch((err) => {
      return res.status(err[0]).send(err[1]);
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  let promise = new Promise((resolve, reject) => {
    const userAuthor = req.params.author;
    var foundBooks = [];
    for (const book in books) {
      if (books[book]["author"] == userAuthor) {
        foundBooks.push(books[book]);
      }
    }
    if (foundBooks.length == 0) reject([404, "Book not found"]);
    resolve(foundBooks);
  });
  promise
    .then((response) => {
      return res.send(response);
    })
    .catch((err) => {
      return res.status(err[0]).send(err[1]);
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  let promise = new Promise((resolve, reject) => {
    const userTitle = req.params.title;
    var foundBook;
    for (const book in books) {
      if (books[book]["title"] == userTitle) {
        foundBook = books[book];
      }
    }
    if (!foundBook) reject([404, "Book not found"]);
    resolve(foundBook);
  });
  promise
    .then((response) => {
      return res.send(response);
    })
    .catch((err) => {
      return res.status(err[0]).send(err[1]);
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const userISBN = req.params.isbn;
  if (!books[userISBN]) return res.status(404).send("Book not found");
  const reviews = books[userISBN]["reviews"];
  return res.send(JSON.stringify(reviews));
});

module.exports.general = public_users;
