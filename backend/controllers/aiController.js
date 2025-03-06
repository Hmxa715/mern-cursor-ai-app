const Query = require("../models/Query");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

// Validate environment variables
const validateEnvVariables = () => {
  const requiredEnvVars = ["OPENAI_API_KEY"];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }
};

// Validate environment variables on startup
try {
  validateEnvVariables();
} catch (error) {
  console.error("Failed to initialize services:", error.message);
  throw new Error("Failed to initialize AI service");
}

const generateResponse = async (req, res) => {
  let queryId = null;
  try {
    // Validate request body
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({
        error: "Invalid request body",
        details: "Request body must be a JSON object"
      });
    }

    const { query } = req.body;

    // Validate query
    if (!query) {
      return res.status(400).json({
        error: "Query is required",
        details: "Please provide a query in the request body"
      });
    }

    if (typeof query !== "string" || query.trim().length === 0) {
      return res.status(400).json({
        error: "Invalid query format",
        details: "Query must be a non-empty string"
      });
    }

    // Create initial query record with pending status
    const newQuery = new Query({
      userQuery: query,
      requestPayload: req.body,
      status: "pending",
      createdAt: new Date()
    });
    await newQuery.save();
    queryId = newQuery._id;

    // Call OpenAI API
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: query
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.data || !response.data.choices || !response.data.choices[0]) {
      throw new Error("Invalid response from OpenAI");
    }

    const aiResponse = response.data.choices[0].message.content;

    // Update query with successful response
    await Query.findByIdAndUpdate(queryId, {
      aiResponse,
      responsePayload: {
        success: true,
        response: aiResponse,
        timestamp: new Date().toISOString()
      },
      status: "completed",
      createdAt: new Date()
    });

    // Send success response
    res.json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error in generateResponse:", error);

    // Update query with failed status if we have a queryId
    if (queryId) {
      await Query.findByIdAndUpdate(queryId, {
        aiResponse: error.message || "Failed to generate response",
        responsePayload: {
          error: "OpenAI API Error",
          details: error.response?.data?.error?.message || error.message
        },
        status: "failed",
        createdAt: new Date()
      });
    }

    // Handle specific error cases
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return res.status(error.response.status).json({
        error: "OpenAI API Error",
        details: error.response.data?.error?.message || "Unknown API error"
      });
    } else if (error.request) {
      // The request was made but no response was received
      return res.status(503).json({
        error: "Service Unavailable",
        details: "No response received from OpenAI"
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      return res.status(500).json({
        error: "Internal Server Error",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined
      });
    }
  }
};

const getAllQueries = async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: queries
    });
  } catch (error) {
    console.error("Error fetching queries:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch queries",
      details: error.message
    });
  }
};

const getQueryById = async (req, res) => {
  try {
    const query = await Query.findById(req.params.id);

    if (!query) {
      return res.status(404).json({
        success: false,
        error: "Query not found"
      });
    }

    res.status(200).json({
      success: true,
      data: query
    });
  } catch (error) {
    console.error("Error fetching query:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch query",
      details: error.message
    });
  }
};

const updateQuery = async (req, res) => {
  try {
    const { userQuery, aiResponse, status } = req.body;

    // Validate status if provided
    if (status && !["pending", "completed", "failed"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status value"
      });
    }

    const query = await Query.findByIdAndUpdate(
      req.params.id,
      { userQuery, aiResponse, status },
      { new: true, runValidators: true }
    );

    if (!query) {
      return res.status(404).json({
        success: false,
        error: "Query not found"
      });
    }

    res.status(200).json({
      success: true,
      data: query
    });
  } catch (error) {
    console.error("Error updating query:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update query",
      details: error.message
    });
  }
};

const deleteQuery = async (req, res) => {
  try {
    const query = await Query.findByIdAndDelete(req.params.id);

    if (!query) {
      return res.status(404).json({
        success: false,
        error: "Query not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Query deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting query:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete query",
      details: error.message
    });
  }
};

module.exports = {
  generateResponse,
  getAllQueries,
  getQueryById,
  updateQuery,
  deleteQuery
};
