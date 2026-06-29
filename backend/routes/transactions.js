import express from "express"
import Book from "../models/Book.js"
import BookTransaction from "../models/BookTransaction.js"
import { formatMongooseError } from "../utils/validation.js"

const router = express.Router()

router.post("/add-transaction", async (req, res) => {
    try {
        if (req.body.isAdmin !== true) {
            return res.status(403).json("You are not allowed to add a transaction.");
        }
        const { bookId, borrowerId, bookName, borrowerName, transactionType, fromDate, toDate } = req.body;
        if (!bookId || !borrowerId || !transactionType || !fromDate || !toDate) {
            return res.status(400).json("All transaction fields are required.");
        }
        if (Date.parse(toDate) < Date.parse(fromDate)) {
            return res.status(400).json("To date must be on or after from date.");
        }
        const newtransaction = await new BookTransaction({
            bookId,
            borrowerId,
            bookName,
            borrowerName,
            transactionType,
            fromDate,
            toDate
        })
        const transaction = await newtransaction.save()
        const book = Book.findById(bookId)
        await book.updateOne({ $push: { transactions: transaction._id } })
        res.status(200).json(transaction)
    }
    catch (err) {
        const { status, message } = formatMongooseError(err);
        res.status(status).json(message);
    }
})

router.get("/all-transactions", async (req, res) => {
    try {
        const transactions = await BookTransaction.find({}).sort({ _id: -1 })
        res.status(200).json(transactions)
    }
    catch (err) {
        return res.status(504).json(err)
    }
})

router.put("/update-transaction/:id", async (req, res) => {
    try {
        if (!req.body.isAdmin) {
            return res.status(403).json("You are not allowed to update a transaction.");
        }
        const allowedFields = ["transactionType", "transactionStatus", "returnDate", "fromDate", "toDate"];
        const updateFields = {};
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) updateFields[field] = req.body[field];
        });
        await BookTransaction.findByIdAndUpdate(req.params.id, { $set: updateFields });
        res.status(200).json("Transaction details updated successfully");
    }
    catch (err) {
        const { status, message } = formatMongooseError(err);
        res.status(status).json(message);
    }
})

router.delete("/remove-transaction/:id", async (req, res) => {
    if (req.body.isAdmin) {
        try {
            const data = await BookTransaction.findByIdAndDelete(req.params.id);
            const book = Book.findById(data.bookId)
            console.log(book)
            await book.updateOne({ $pull: { transactions: req.params.id } })
            res.status(200).json("Transaction deleted successfully");
        } catch (err) {
            return res.status(504).json(err);
        }
    } else {
        return res.status(403).json("You dont have permission to delete a book!");
    }
})

export default router