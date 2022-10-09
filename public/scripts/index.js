const status = document.querySelector(".status");
let error;
fetch(API)
  .then((res) => (res.status !== 200 ? (error = true) : res.json()))
  .then((data) => {
    if (error) {
      status.innerHTML = "there was an error";
    } else {
      if (data.length > 0) {
        data = data.reverse();

        for (i = 0; i < data.length; i++) {
          const divPost = document.createElement("div");
          divPost.classList.add("post");

          const div = document.createElement("div");
          const anchor = document.createElement("a");
          anchor.href = `/post/${data[i].id}`;

          const h3 = document.createElement("h3");
          const sup = document.createElement("sup");

          if (data[i].explicit === "true") {
            sup.innerHTML = " (explicit)";
          } else sup.innerHTML = "";

          const paragraph = document.createElement("p");

          h3.innerHTML = data[i].title;
          paragraph.innerHTML = `Created: ${data[i].timestamp}`;

          h3.appendChild(sup);
          div.appendChild(h3);
          div.appendChild(paragraph);

          anchor.appendChild(div);
          divPost.appendChild(anchor);

          document.querySelector("main").appendChild(divPost);
        }

        status.style.display = "none";
      } else status.innerHTML = "i havent posted anything yet.";
    }
  });
