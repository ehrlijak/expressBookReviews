const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Helper async functions for Tasks 10–13
async function getAllBooks() {
    return books;
}

async function getBookByISBN(isbn) {
    const book = books[isbn];
    if (book) return book;
    else throw "Book not found";
}

async function getBooksByAuthor(author) {
    const keys = Object.keys(books);
    let matches = [];
    for (let key of keys) {
        if (books[key].author === author) {
            matches.push(books[key]);
        }
    }
    return matches;
}

async function getBooksByTitle(title) {
    const keys = Object.keys(books);
    let matches = [];
    for (let key of keys) {
        if (books[key].title === title) {
            matches.push(books[key]);
        }
    }
    return matches;
}

// Task 6: Register user
public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    const userExists = users.some(user => user.username === username);
    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }
    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully" });
});

// Task 10: Get all books
public_users.get('/', async (req, res) => {
    try {
        const allBooks = await getAllBooks();
        res.status(200).json(allBooks);
    } catch (err) {
        res.status(500).json({ message: err });
    }
});

// Task 11: Get book by ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const book = await getBookByISBN(req.params.isbn);
        res.json(book);
    } catch (err) {
        res.status(404).json({ message: err });
    }
});

// Task 12: Get books by author
public_users.get('/author/:author', async (req, res) => {
    try {
        const booksByAuthor = await getBooksByAuthor(req.params.author);
        res.json(booksByAuthor);
    } catch (err) {
        res.status(404).json({ message: err });
    }
});

// Task 13: Get books by title
public_users.get('/title/:title', async (req, res) => {
    try {
        const booksByTitle = await getBooksByTitle(req.params.title);
        res.json(booksByTitle);
    } catch (err) {
        res.status(404).json({ message: err });
    }
});

// Task 5: Get book reviews
public_users.get('/review/:isbn', async (req, res) => {
    try {
        const book = await getBookByISBN(req.params.isbn);
        res.json(book.reviews);
    } catch (err) {
        res.status(404).json({ message: err });
    }
});

module.exports.general = public_users;

