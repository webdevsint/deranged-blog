const session = require("express-session");
const passport = require("passport");
const express = require("express");
const axios = require("axios");
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

app.get("/login", (req, res) => {
  res.redirect("/auth/google");
});

app.get("/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy();
    res.send("Logged out...");
  });
});

// authentication
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/admin/posts",
    failureRedirect: "/auth/google/failure",
  })
);

app.get("/auth/google/failure", (req, res) => {
  res.send("Failed to authenticate..");
});

app.get("/", (req, res) => {
  res.send("welcome to the deranged blog api. are you an admin ?");
});

// returns a specific post
app.get("/post/:id", (req, res) => {
  const id = req.params.id;

  axios
    .get(API, {
      params: { key: KEY },
    })
    .then((response) => {
      const data = response.data;

      const post = data.filter((item) => item.id === id);

      if (post.length < 1) {
        res.status(404).json({ message: "post not found" });
      } else {
        const title = post[0].title;
        const author = post[0].author;
        const timestamp = post[0].timestamp;
        const body = post[0].body;

        res.render("post", { title, author, timestamp, body });
      }
    })
    .catch((err) => console.log(err));
});

// returns all posts
app.get("/admin/posts", isLoggedIn, (req, res) => {
  axios
    .get(API, {
      params: { key: KEY },
    })
    .then((response) => {
      const data = response.data;

      res.render('posts', { data, api: API, key: KEY })
    })
    .catch((err) => console.log(err));
});

app.get("/posts", (req, res) => {
  axios
    .get(API, {
      params: { key: KEY },
    })
    .then((response) => {
      const data = response.data;

      res.render('index', { data })
    })
    .catch((err) => console.log(err));
});

// create a new post
app.get("/admin/new", isLoggedIn, (req, res) => {
  res.render("new", { api: API, key: KEY, user: req.user.displayName });
});

app.listen(PORT, () => {
  console.log(`web server listening on port ${PORT}`);
});
