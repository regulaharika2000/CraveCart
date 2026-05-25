const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Get authorization header
  const authHeader = req.headers.authorization;

  // Check token exists
  if (!authHeader) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  // Extract token
  const token = authHeader.split(" ")[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Save user data in request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

module.exports = authMiddleware;