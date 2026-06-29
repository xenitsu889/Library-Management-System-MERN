import express from "express"
import Book from "../models/Book.js"
import BookCategory from "../models/BookCategory.js"
import { formatMongooseError, parsePositiveInt } from "../utils/validation.js"

const router = express.Router()

/* Get all books in the db */
router.get("/allbooks", async (req, res) => {
    try {
        const books = await Book.find({}).populate("transactions").sort({ _id: -1 })
        res.status(200).json(books)
    }
    catch (err) {
        return res.status(504).json(err);
    }
})

/* Get Book by book Id */
router.get("/getbook/:id", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate("transactions")
        res.status(200).json(book)
    }
    catch {
        return res.status(500).json(err)
    }
})

/* Get books by category name*/
router.get("/", async (req, res) => {
    const category = req.query.category
    try {
        const books = await BookCategory.findOne({ categoryName: category }).populate("books")
        res.status(200).json(books)
    }
    catch (err) {
        return res.status(504).json(err)
    }
})

/* Adding book */
router.post("/addbook", async (req, res) => {
    if (!req.body.isAdmin) {
        return res.status(403).json("You don't have permission to add a book.");
    }
    try {
        if (!req.body.bookName?.trim() || !req.body.author?.trim()) {
            return res.status(400).json("Book name and author are required.");
        }
        const countResult = parsePositiveInt(req.body.bookCountAvailable, "Number of copies");
        if (countResult.error) {
            return res.status(400).json(countResult.error);
        }
        if (!Array.isArray(req.body.categories) || req.body.categories.length === 0) {
            return res.status(400).json("At least one category is required.");
        }
        const newbook = await new Book({
            bookName: req.body.bookName.trim(),
            alternateTitle: req.body.alternateTitle?.trim() || "",
            author: req.body.author.trim(),
            bookCountAvailable: countResult.value,
            language: req.body.language?.trim() || "",
            publisher: req.body.publisher?.trim() || "",
            bookStatus: req.body.bookSatus,
            categories: req.body.categories
        })
        const book = await newbook.save()
        await BookCategory.updateMany({ '_id': book.categories }, { $push: { books: book._id } });
        res.status(200).json(book)
    }
    catch (err) {
        const { status, message } = formatMongooseError(err);
        res.status(status).json(message);
    }
})

/* Addding book */
router.put("/updatebook/:id", async (req, res) => {
    if (!req.body.isAdmin) {
        return res.status(403).json("You don't have permission to update a book.");
    }
    try {
        const updateFields = {};
        if (req.body.bookCountAvailable !== undefined) {
            const countResult = parsePositiveInt(req.body.bookCountAvailable, "Number of copies");
            if (countResult.error) {
                return res.status(400).json(countResult.error);
            }
            updateFields.bookCountAvailable = countResult.value;
        }
        if (req.body.bookName !== undefined) updateFields.bookName = req.body.bookName;
        if (req.body.author !== undefined) updateFields.author = req.body.author;
        if (req.body.bookStatus !== undefined) updateFields.bookStatus = req.body.bookStatus;

        await Book.findByIdAndUpdate(req.params.id, { $set: updateFields });
        res.status(200).json("Book details updated successfully");
    }
    catch (err) {
        const { status, message } = formatMongooseError(err);
        res.status(status).json(message);
    }
})

/* Remove book  */
router.delete("/removebook/:id", async (req, res) => {
    if (req.body.isAdmin) {
        try {
            const _id = req.params.id
            const book = await Book.findOne({ _id })
            await book.remove()
            await BookCategory.updateMany({ '_id': book.categories }, { $pull: { books: book._id } });
            res.status(200).json("Book has been deleted");
        } catch (err) {
            return res.status(504).json(err);
        }
    } else {
        return res.status(403).json("You dont have permission to delete a book!");
    }
})

export default router