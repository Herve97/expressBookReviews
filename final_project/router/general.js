const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
let axios = require('axios');

// let myUsers = []

const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registred" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    let myPromise = new Promise((resolve,reject) => {
        resolve(JSON.stringify(books, null, 4))
        reject("Unable to fetch book list")
    })
    myPromise.then((data)=>{
        res.send(data)
    }).catch((error)=>{
        res.send(error.message)
    })
    //return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    let myPromise = new Promise((resolve,reject) => {
        resolve(books[isbn])
        reject("Unable to fetch book isbn")
    })
    myPromise.then((data)=>{
        res.send(data)
    }).catch((error)=>{
        res.send(error.message)
    })
    // res.send(books[isbn])
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    let myPromise = new Promise((resolve,reject) => {
        let authorBooks = [];
        Object.entries(books).forEach(([key, value]) => {
            if (value.author === author) {
                authorBooks.push(value.title)
            }
        })
        resolve(authorBooks)
        reject("Unable to fetch book isbn")
    })
    myPromise.then((data)=>{
        res.send(data)
    }).catch((error)=>{
        res.send(error.message)
    })
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    let myPromise = new Promise((resolve,reject) => {
        let val;
        Object.entries(books).forEach(([key, value]) => {
            if (value.title === title) {
                val ={ author: value.author, title: value.title, reviews: value.reviews }
            }
        })
        resolve(val)
        reject("Unable to fetch book isbn")
    })
    myPromise.then((data)=>{
        res.send(data)
    }).catch((error)=>{
        res.send(error.message)
    })

    // Object.entries(books).forEach(([key, value]) => {
    //     if (value.title === title) {
    //         res.send({ author: value.author, title: value.title, reviews: value.reviews })
    //     }
    // })

});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn])
});

module.exports.general = public_users;
