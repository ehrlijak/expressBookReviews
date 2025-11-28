const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
const { username, password } = req.body;

    // Check if username or password missing
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if user already exists
    const userExists = users.some(user => user.username === username);
    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    // Add new user
    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully" });
});


public_users.get('/',function (req, res) {
 
 return res.status(200).send(JSON.stringify(books, null, 2));
});

public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;        // 1. Get ISBN from URL
    const book = books[isbn];            // 2. Lookup book in database

    if (book) {                          // 3. If found
        return res.json(book);           // Respond with JSON
    } else {                             // 4. If not found
        return res.status(404).json({ message: "Book not found" });
    }
});
  

public_users.get('/author/:author',function (req, res) {
  const keys = Object.keys(books);
let matches = [];

for (let key of keys) {
    let book = books[key];
    if (book.author === req.params.author) {
        matches.push(book);
    }
}

return res.json(matches);
 
});

public_users.get('/title/:title',function (req, res) {
 
	const keys = Object.keys(books);

	let matches = [];

	for (let key of keys) {
    let book = books[key];
    if (book.title === req.params.title) {
        matches.push(book);
    }
}

return res.json(matches);		

  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {

const isbn = req.params.isbn;        // 1. Get ISBN from URL
    const book = books[isbn];            // 2. Lookup book in database

    if (book) {                          // 3. If found
        return res.json(book.reviews);           // Respond with JSON
    } else {                             // 4. If not found
        return res.status(404).json({ message: "Book not found" });
    }

 });

module.exports.general = public_users;
