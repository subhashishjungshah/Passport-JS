require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
var bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
mongoose.connect(process.env.MONGO_URI);

const UserSchema = new mongoose.Schema({
  username: { type: String },
  password: Number,
  name: String,
});
const User = mongoose.model("User", UserSchema);

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);
app.use(passport.initialize());
app.use(passport.session());
// setting up middle ware for passport
passport.use(
  new LocalStrategy(async function (username, password, done) {
    console.log(username, password);
    user = await User.findOne({ username });
    if (!user) {
      return done(null, false, { message: "Incorrect username" });
    }
    if (!user.password == password) {
      return done(null, false, { message: "Incorrect Password" });
    }
    return done(null, user);
  })
);
passport.serializeUser((user, done) => {
  if (user) {
    return done(null, user.id);
  }
});
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  if (!user) {
    return done(null, false);
  }
  return done(null, user);
});

app.get("/", (req, res) => {
  res.send("Hello world!" + req.user.username);
});
app.post("/login", passport.authenticate("local"), (req, res) => {
  res.redirect("/");
});
app.post("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy(function (err) {
      res.send("destroyed"); // Redirect to the home page after logging out
    });
  });
});
app.listen(3000, console.log("Listening to port 3000"));
