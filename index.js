const session = require("express-session");
const passport = require("passport");
const express = require("express");
const axios = require("axios");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
require("./auth");

const app = express();

const PORT = process.env.PORT;
const API = process.env.API_URI;
const KEY = process.env.API_KEY;

app.use(cors());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");
app.use(express.static("public"));

const admins = ["nehan.khan779@gmail.com", "nehanyaser@gmail.com"];

function isLoggedIn(req, res, next) {
  if (req.user) {
    if (admins.includes(req.user.email) === true) {
      next();
    } else if (admins.includes(req.user.email) === false) {
      req.logout(() => {
        req.session.destroy();
        res.send("You are not an admin!");
      });
    }
  } else {
    res.redirect("/login");
  }
}

app.get("/", (req, res) => {
  res.sendFile(path.resolve("./views/index.html"));
});

// authentication
app.get("/login", (req, res) => {
  res.redirect("/auth/google");
});

app.get("/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy();
    res.redirect('/')
  });
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/admin",
    failureRedirect: "/auth/google/failure",
  })
);

app.get("/auth/google/failure", (req, res) => {
  res.send("Failed to authenticate..");
});

// blog
app.get("/posts", (req, res) => {
  res.sendFile(path.resolve("./views/posts.html"));
});

app.get("/post/:id", (req, res) => {
  res.sendFile(path.resolve("./views/post.html"));
});

// admin functions
app.get("/admin", isLoggedIn, (req, res) => {
  res.render("admin", { user: req.user.given_name });
});

app.get("/admin/posts", isLoggedIn, (req, res) => {
  res.sendFile(path.resolve("./views/posts_admin.html"));
});

app.get("/admin/new", isLoggedIn, (req, res) => {
  res.render("new", { api: API, key: KEY, user: req.user.displayName });
});

app.listen(PORT, () => {
  console.log(`server started @ http://localhost:${PORT}/`);
});
