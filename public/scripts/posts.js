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

fetch("https://dblog-db.nehanyaser.repl.co/document/posts?key=WCUEWOe4rPFV")
  .then((res) => (res.status !== 200 ? (error = true) : res.json()))
  .then((data) => {
    if (sort === "old") {
      data = data;
    } else {
      data = data.reverse();
    }

    if (error) {
      status.innerHTML = "there was an error";
    } else {
      for (i = 0; i < data.length; i++) {
        const divPost = document.createElement("div");
        divPost.classList.add("post");

        const div = document.createElement("div");
        const anchor = document.createElement("a");
        anchor.href = `/post/${data[i].id}`;

        const h3 = document.createElement("h3");
        const sup = document.createElement("sup");

        if (data[i].explicit === "true") {
          sup.innerHTML = "(explicit)";
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
    }
  });
