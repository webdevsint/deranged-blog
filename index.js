const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT;
const API = process.env.API_URI;
const KEY = process.env.API_KEY;

app.use(cors());

app.set("view engine", "ejs");
app.use(express.static('public'))

app.get("/", (req, res) => {
  res.send("welcome to the deranged podcast api. are you an admin ?");
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
        res.send(post);
      }
    })
    .catch((err) => console.log(err));
});

// returns all posts
app.get("/admin/posts", (req, res) => {
  axios
    .get(API, {
      params: { key: KEY },
    })
    .then((response) => {
      const data = response.data;

      res.send(data);
    })
    .catch((err) => console.log(err));
});

// form to create a new post
app.get("/admin/new", (req, res) => {
  res.render("new", { api: API, key: KEY });
});

app.listen(PORT, () => {
  console.log(`web server listening on port ${PORT}`);
});
