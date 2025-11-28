const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {

regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // 1. Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    // 2. Check if user exists and password matches
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // 3. Generate JWT token for valid user
    const accessToken = jwt.sign({ username: username }, "access", { expiresIn: '1h' });

    // 4. Save token in session
    req.session.authorization = {
        accessToken,
        username
    };

    // 5. Respond with success
    return res.status(200).json({ message: "User successfully logged in", token: accessToken });
});





});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
     const isbn = req.params.isbn;                    // Get ISBN from URL
    const review = req.query.review;                 // Review comes from query string
    const username = req.user?.username;             // Username stored in session via JWT

    if (!username) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    if (!review) {
        return res.status(400).json({ message: "Review text is required in query parameter 'review'" });
    }

    const book = books[isbn];                        // Lookup book by ISBN
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Add or update the user's review
    book.reviews[username] = review;

    return res.json({ message: `Review for ISBN ${isbn} by ${username} added/updated successfully`, reviews: book.reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
