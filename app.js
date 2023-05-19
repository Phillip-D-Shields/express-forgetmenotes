var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const msSqlDb = require("./db/setup-ms-sql-db");
const sqliteDb = require("./db/setup-sqlite-db");

var notesRouter = require("./routes/notes");
var usersRouter = require("./routes/users");

var app = express();

Promise.all([msSqlDb.createTable(), sqliteDb.createTable()])
  .then(() => {
    app.use(logger("dev"));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, "public")));

    app.use("/notes", notesRouter);
    app.use("/users", usersRouter);

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
      next(createError(404));
    });

    // error handler
    app.use(function (err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get("env") === "development" ? err : {};

      // render the error page
      res.status(err.status || 500);
    });
  })
  .catch((err) => {
    console.error("Failed to setup databases:", err);
  });

module.exports = app;
