const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

// Load available books (json filenames in /books)
const booksDir = path.join(__dirname, "books");
const bookFiles = fs.readdirSync(booksDir).filter(f => f.endsWith(".json"));

// Helper: load one book
function loadBook(bookName) {
    const filePath = path.join(booksDir, `${bookName}.json`);
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

// Home page -> list books
app.get("/", (req, res) => {
    const books = bookFiles.map(f => f.replace(".json", ""));
    res.render("index", { books });
});

// Book page -> list chapters
app.get("/book/:name", (req, res) => {
    const bookName = req.params.name.toLowerCase();
    const book = loadBook(bookName);
    const chapters = Object.keys(book.chapters);
    res.render("book", { book, chapters });
});

// Chapter page -> show verses + navigation
app.get("/book/:name/:chapter", (req, res) => {
    const bookName = req.params.name.toLowerCase();
    const chapterNum = req.params.chapter;
    const book = loadBook(bookName);

    const chapters = Object.keys(book.chapters);
    const chapter = book.chapters[chapterNum];
    
    // Navigation
    const prev = chapters.includes((+chapterNum - 1).toString()) ? +chapterNum - 1 : null;
    const next = chapters.includes((+chapterNum + 1).toString()) ? +chapterNum + 1 : null;

    res.render("chapter", { book, chapterNum, chapter, prev, next });
});

app.listen(PORT, () => {
    console.log(`Bible app running → http://localhost:${PORT}`);
});
