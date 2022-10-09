const status = document.querySelector(".status");

const url = location.href;
const id = url.split("/")[4];

let error;

fetch(API)
  .then((res) => (res.status !== 200 ? (error = true) : res.json()))
  .then((data) => {
    if (error) {
      status.innerHTML = "there was an error";
      document.title = "error";
    } else {
      const post = data.filter((i) => i.id === id)[0];

      if (post !== undefined) {
        document.title = post.title;

        document.querySelector(".title").innerHTML = post.title;
        document.querySelector(
          ".author"
        ).innerHTML = `by <span style="text-decoration: underline;">${post.author}</span>`;
        document.querySelector(
          ".timestamp"
        ).innerHTML = `created: ${post.timestamp}`;
        document.querySelector(".body").innerHTML = post.body;

        if (post.explicit === "true") {
          document.querySelector(".explicit").innerHTML =
            "this is an <b>explicit</b> post.";
          document.querySelector(".break").style.display = "block";
        }

        status.style.display = "none";
        document.querySelector(".post").style.display = "block";
      } else {
        status.innerHTML = "post not found";
        document.title = "404";
      }
    }
  });
