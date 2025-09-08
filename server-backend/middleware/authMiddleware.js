// server-backend/middlewares/authMiddleware.js

const jwt = require("jsonwebtoken");
const User = require("../models/User"); // adjust model name if different

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ error: "User not found" });
      }

      req.user.role = decoded.role;

      next();
    } catch (err) {
      console.error(err);
      res.status(401).json({ error: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ error: "No token, authorization denied" });
  }
};

