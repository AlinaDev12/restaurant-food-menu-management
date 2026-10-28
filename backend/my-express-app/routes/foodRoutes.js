
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const Food = require("../models/Food");
const Category = require("../models/Category");
const upload = require("../middleware/upload");

const isValidId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

const deleteImage = (image) => {
  if (!image || !image.startsWith("/uploads/")) return;

  const filename = path.basename(image);
  const filePath = path.join(__dirname, "..", "uploads", filename);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// ADD FOOD
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { foodName, price, description, category } = req.body;

    if (
      !foodName?.trim() ||
      price === undefined ||
      price === "" ||
      !description?.trim() ||
      !category ||
      !req.file
    ) {
      return res.status(400).json({
        message: "Food name, price, description, category and image are required",
      });
    }

    const parsedPrice = Number(price);

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({
        message: "Price must be greater than zero",
      });
    }

    if (!isValidId(category)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      return res.status(400).json({
        message: "Selected category does not exist",
      });
    }

    const food = await Food.create({
      name: foodName.trim(),
      price: parsedPrice,
      description: description.trim(),
      category,
      image: `/uploads/${req.file.filename}`,
    });

    return res.status(201).json({
      message: "Food added successfully",
      food,
    });
  } catch (error) {
    if (req.file) deleteImage(`/uploads/${req.file.filename}`);

    return res.status(500).json({ message: error.message });
  }
});

// DISPLAY ALL FOODS
router.get("/", async (req, res) => {
  try {
    const foods = await Food.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json(foods);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// DISPLAY SINGLE FOOD
router.get("/:id", async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid food ID" });
    }

    const food = await Food.findById(req.params.id)
      .populate("category", "name");

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    return res.status(200).json(food);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// EDIT FOOD
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid food ID" });
    }

    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    const { foodName, price, description, category } = req.body;

    if (foodName !== undefined) {
      if (!foodName.trim()) {
        return res.status(400).json({ message: "Food name cannot be empty" });
      }
      food.name = foodName.trim();
    }

    if (description !== undefined) {
      if (!description.trim()) {
        return res.status(400).json({ message: "Description cannot be empty" });
      }
      food.description = description.trim();
    }

    if (price !== undefined) {
      const parsedPrice = Number(price);

      if (price === "" || !Number.isFinite(parsedPrice) || parsedPrice <= 0) {
        return res.status(400).json({
          message: "Price must be a valid number greater than zero",
        });
      }

      food.price = parsedPrice;
    }

    if (category !== undefined) {
      if (!isValidId(category)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }

      const categoryExists = await Category.findById(category);

      if (!categoryExists) {
        return res.status(400).json({
          message: "Selected category does not exist",
        });
      }

      food.category = category;
    }

    const oldImage = food.image;

    if (req.file) {
      food.image = `/uploads/${req.file.filename}`;
    }

    const updatedFood = await food.save();

    if (req.file) deleteImage(oldImage);

    return res.status(200).json({
      message: "Food updated successfully",
      food: updatedFood,
    });
  } catch (error) {
    if (req.file) deleteImage(`/uploads/${req.file.filename}`);

    return res.status(400).json({ message: error.message });
  }
});

// DELETE FOOD
router.delete("/:id", async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid food ID" });
    }

    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    deleteImage(food.image);
    await food.deleteOne();

    return res.status(200).json({
      message: "Food deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
