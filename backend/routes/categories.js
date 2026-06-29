import express from "express";
import BookCategory from "../models/BookCategory.js";
import { formatMongooseError } from "../utils/validation.js";

const router = express.Router();

router.get("/allcategories", async (req, res) => {
  try {
    const categories = await BookCategory.find({});
    res.status(200).json(categories);
  } catch (err) {
    return res.status(504).json(err);
  }
});

router.post("/addcategory", async (req, res) => {
  try {
    if (!req.body.isAdmin) {
      return res.status(403).json("Only admins can add categories.");
    }
    if (!req.body.categoryName?.trim()) {
      return res.status(400).json("Category name is required.");
    }
    const newcategory = await new BookCategory({
      categoryName: req.body.categoryName.trim(),
    });
    const category = await newcategory.save();
    res.status(200).json(category);
  } catch (err) {
    const { status, message } = formatMongooseError(err);
    res.status(status).json(message);
  }
});

router.delete("/removecategory/:id", async (req, res) => {
  try {
    if (!req.body.isAdmin) {
      return res.status(403).json("Only admins can delete categories.");
    }
    const category = await BookCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json("Category not found.");
    }
    if (category.books?.length > 0) {
      return res.status(400).json("Cannot delete a category that still has books assigned.");
    }
    await category.deleteOne();
    res.status(200).json("Category deleted successfully");
  } catch (err) {
    const { status, message } = formatMongooseError(err);
    res.status(status).json(message);
  }
});

export default router;
