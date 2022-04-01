const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const accessToken = req.cookies.access_token;
  if (!accessToken) {
    return res.status(401).json({
      message: "User Not Authenticated",
    });
  }
  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_KEY || "secret");
    req.user = decoded;
    if (decoded.role === "user") {
      next();
    } else {
      return res.status(401).json({
        message: "Authentication failed",
      });
    }
  } catch (err) {
    return res.status(401).json({
      message: "Auth failed",
      error: err,
    });
  }
};

module.exports = { verifyToken };
