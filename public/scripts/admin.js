const status = document.querySelector(".status");
let error;

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

let sort = params.sort;

if (sort === "old") {
  document.querySelector(".sort").innerHTML = "sort by new";
  document.querySelector(".sort").href = "/posts?sort=new";
}

fetch(API)
  .then((res) => res.json())
  .then((data) => {
    if (error) {
      status.innerHTML = "there was an error";
    } else {
      if (sort === "old") {
        data = data;
      } else {
        data = data.reverse();
      }

      if (data.length > 0) {
        data.forEach((element, index) => {
          const divPost = document.createElement("div");
          divPost.classList.add("post");

          const div = document.createElement("div");
          const anchor = document.createElement("a");
          anchor.href = `/post/${data[index].id}`;

          const h3 = document.createElement("h3");
          const sup = document.createElement("sup");

          if (data[index].explicit === "true") {
            sup.innerHTML = " (explicit)";
          } else sup.innerHTML = "";

          const paragraph = document.createElement("p");
          const btn = document.createElement("button");
          btn.innerText = "delete post";
          btn.onclick = () => {
            fetch(
              `https://dblog-db.nehanyaser.repl.co/document/posts?key=WCUEWOehcid&index=${index}`,
              { method: "DELETE" }
            )
              .then((res) => res.json())
              .then((data) => location.reload());
          };

          h3.innerHTML = data[index].title;
          paragraph.innerHTML = `Created: ${data[index].timestamp}`;

          h3.appendChild(sup);
          div.appendChild(h3);
          div.appendChild(paragraph);

          anchor.appendChild(div);
          divPost.appendChild(anchor);
          divPost.appendChild(btn);

          document.querySelector("main").appendChild(divPost);
        });

        status.style.display = "none";
      } else status.innerHTML = "i havent posted anything yet.";
    }
  });
