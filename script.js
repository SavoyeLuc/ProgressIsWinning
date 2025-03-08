document.addEventListener("DOMContentLoaded", () => {
   loadPosts();
});

function submitPost() {
   const title = document.getElementById("postTitle").value;
   const content = document.getElementById("postContent").value;
   const source = document.getElementById("postSource").value;

   if (!title || !content || !source) {
       alert("Please fill out all fields.");
       return;
   }

   const post = {
       title,
       content,
       source,
       votes: 0,
   };

   let posts = JSON.parse(localStorage.getItem("posts")) || [];
   posts.push(post);
   localStorage.setItem("posts", JSON.stringify(posts));

   loadPosts();
}

function loadPosts() {
   const postsContainer = document.getElementById("posts-container");
   postsContainer.innerHTML = "";

   let posts = JSON.parse(localStorage.getItem("posts")) || [];

   posts.forEach((post, index) => {
       const postElement = document.createElement("div");
       postElement.classList.add("post");

       postElement.innerHTML = `
           <h3>${post.title}</h3>
           <p>${post.content}</p>
           <a href="${post.source}" target="_blank">Source</a>
           <div class="vote-buttons">
               <button onclick="vote(${index}, 1)">👍 ${post.votes}</button>
               <button onclick="vote(${index}, -1)">👎</button>
           </div>
       `;

       postsContainer.appendChild(postElement);
   });
}

function vote(index, change) {
   let posts = JSON.parse(localStorage.getItem("posts")) || [];
   posts[index].votes += change;
   localStorage.setItem("posts", JSON.stringify(posts));
   loadPosts();
}
