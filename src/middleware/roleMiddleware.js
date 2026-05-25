const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    // Check role allowed
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    next();
  };
};

module.exports = roleMiddleware;