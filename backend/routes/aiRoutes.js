const express = require("express");
const router = express.Router();
const {
  generateResponse,
  getAllQueries,
  getQueryById,
  updateQuery,
  deleteQuery
} = require("../controllers/aiController");

// Create a new query and get AI response
router.post("/generate", generateResponse);

// Get all queries
router.get("/queries", getAllQueries);

// Get a single query by ID
router.get("/queries/:id", getQueryById);

// Update a query
router.put("/queries/:id", updateQuery);

// Delete a query
router.delete("/queries/:id", deleteQuery);

module.exports = router;
