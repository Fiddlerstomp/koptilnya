const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

const publicPath = path.join(__dirname, "../public");
const dbPath = path.join(__dirname, "../db", "books.db");

app.use(express.static(publicPath));
app.use(express.json());

fs.access(dbPath, fs.constants.F_OK, err => {
    if (err) {
        console.log("books.db did not exist. Creating books.db...");
        fs.writeFile(dbPath, "", err => {
            if (err) {
                console.error("Could not create books.db with error: ", err);
            } else {
                console.log("Successfully created books.db");
            }
        })
    }
});

const db = new sqlite3.Database(dbPath, err => {
    if (err) {
        console.error("Could not connect to database with error: ", err);
    } else {
        console.log("Successfully connected to database.");
    }
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstname TEXT,
        lastname TEXT,
        phone TEXT,
        date TIMESTAMP,
        guests INTEGER
    );`);
})


app.get("/", (req, res) => {
    console.log("New connection.")
    res.sendFile(path.join(publicPath, "index.html"));
});

app.post("/submit_book", (req, res) => {
    console.log("New submit.");
    const book = req.body;
    writeBookToDB(book);
    res.send("ok");
})

app.listen(port, () => {
    console.log(`Listening on localhost:${port}`);
});

function writeBookToDB({firstname, lastname, phone, date, guests}) {
    db.serialize(() => {
        db.run(`INSERT INTO books (firstname, lastname, phone, date, guests) VALUES (?, ?, ?, ?, ?)`,
            [firstname, lastname, phone, date, guests], err => {
            if (err) {
                console.error("Could not write book with error: ", err);
            } else {
                console.log("Successfully write book to database.")
            }
            });
    })
}