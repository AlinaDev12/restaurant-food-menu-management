const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const Category = require("../models/Category");
const Food = require("../models/Food");
const upload = require("../middleware/upload");

// @route   POST /api/categories
// @desc    Add Category
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name?.trim() || !description?.trim() || !req.file) {
      return res.status(400).json({
        message: "Name, description and image are required",
      });
    }

    const category = await Category.create({
      name: name.trim(),
      description: description.trim(),
      image: `/uploads/${req.file.filename}`,
    });

    res.status(201).json({
      message: "Category added successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/categories
// @desc    Display All Categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/categories/:id
// @desc    Display Single Category
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ message: "Invalid category ID" });
  }
});

// @route   PUT /api/categories/:id
// @desc    Edit Category
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const { name, description } = req.body;

    if (!name?.trim() || !description?.trim()) {
      return res.status(400).json({
        message: "Name and description are required",
      });
    }

    category.name = name.trim();
    category.description = description.trim();

    // If new image uploaded, replace old one
    if (req.file) {
      const oldImage = category.image;
      category.image = `/uploads/${req.file.filename}`;

      if (oldImage) {
        const oldPath = path.join(
          __dirname,
          "..",
          oldImage.replace(/^\/+/, "")
        );
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    const updatedCategory = await category.save();

    res.status(200).json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/categories/:id
// @desc    Delete Category
router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Delete all foods of this category
    await Food.deleteMany({ category: req.params.id });

    // Delete category image file
    if (category.image) {
      const imagePath = path.join(
        __dirname,
        "..",
        category.image.replace(/^\/+/, "")
      );
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await category.deleteOne();

    res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
