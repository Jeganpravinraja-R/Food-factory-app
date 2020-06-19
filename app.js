const winston = require("winston");
require("dotenv").config();
const express = require("express");
const app = express();

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/validation")();
require("./startup/production")(app);

const port = process.env.PORT;

app.listen(port, () => winston.info(`listening on port ${port}... `));
