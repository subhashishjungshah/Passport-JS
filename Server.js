const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");

const app = express();

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://subhu1:subhu123@cluster0.vfc3zpb.mongodb.net/session-test?retryWrites=true&w=majority",
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.listen(3000, console.log("Listening to port 3000"));
