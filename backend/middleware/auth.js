const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");

dotenv.config();

const auth = async (req, res, next) => {
  try {
    // console.log("Auth middleware - Request headers:", req.headers);
    const token = req.header("Authorization")?.replace("Bearer ", "");
    // console.log("Auth middleware - Token:", token);

    if (!token) {
      console.log("Auth middleware - No token provided");
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Auth middleware - Decoded token:", decoded);

    const user = await User.findOne({ _id: decoded.userId });
    // console.log("Auth middleware - Found user:", user);

    if (!user) {
      console.log("Auth middleware - No user found");
      throw new Error();
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.log("Auth middleware - Error:", error.message);
    res.status(401).json({ error: "Please authenticate." });
  }
};

module.exports = auth;
