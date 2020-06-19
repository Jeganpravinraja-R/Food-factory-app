const jwt = require("jsonwebtoken");

function reset(req, res, next) {
  const token = req.header("x-reset-token");
  if (!token) return res.status(400).send("Invalid token or it is expired");

  try {
    const decoded = jwt.verify(token, process.env.JWT_PASSWORD_KEY);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Authentication error");
  }
}

module.exports = reset;
