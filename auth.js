const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(400).send("Access denied!!! invalid token");

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACC_ACTIVATE);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token");
  }
}

module.exports = auth;
