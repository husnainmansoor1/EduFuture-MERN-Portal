// Role-Based Access Control Middleware

// Admin only - must be approved
exports.adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  if (req.user.adminStatus !== "approved") {
    return res
      .status(403)
      .json({ message: "Access denied. Admin not approved." });
  }
  next();
};

// Teacher only
exports.teacherOnly = (req, res, next) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ message: "Access denied. Teacher only." });
  }
  next();
};

// Student only
exports.studentOnly = (req, res, next) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Access denied. Student only." });
  }
  next();
};
