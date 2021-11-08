const express = require("express");
const cors = require("cors");
const app = express();

const usersRouter = require("./routes/users");

const notFound = require("./errors/notFound");
const errorHandler = require("./errors/errorHandler");

app.use(cors());
app.use(express.json());

app.use("/users", usersRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
