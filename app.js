require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");
const error = require("./middleware/error");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const config = require("config");
const morgan = require("morgan");
const express = require("express");
const helmet = require("helmet");
const app = express();
const books = require("./routes/books");
const users = require("./routes/users");
const genres = require("./routes/genres");
const authors = require("./routes/authors");
const publishers = require("./routes/publishers");
const auth = require("./routes/auth");

const logger = winston.createLogger({
  transports: [new winston.transports.File({ filename: "combined.log" })],
  exceptionHandlers: [
    new winston.transports.File({ filename: "exceptions.log" }),
    new winston.transports.MongoDB({ db: "mongodb://localhost/bibloDB" }),
  ],
  exitOnError: false,
});

throw new Error("Algo salio mal");

if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

mongoose.connect("mongodb://localhost/bibloDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to mongoDB...");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.use("/api/books", books);
app.use("/api/users", users);
app.use("/api/genres", genres);
app.use("/api/authors", authors);
app.use("/api/publishers", publishers);
app.use("/api/auth", auth);

app.use(error);

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  console.log("Morgan enabled...");
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
