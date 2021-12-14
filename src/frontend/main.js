async function init() {
  fetchPosts();
  let allPostsJson = await fetchPosts();
  appendPosts(allPostsJson);
}

async function fetchPosts() {
  const fetchData = await fetch("../../src/backend/json/posts.json")
    .then((res) => res.json())
    .then((data) => {
      return data;
    });

  return fetchData;
}
function appendPosts(posts) {
  document.querySelector("#posts-feed-container").innerHTML = "";
  let htnlTemplate = ``;
  for (let post of posts) {
    htnlTemplate = `
    <article onclick = "appendAndGoPostDetails(${post.post_id},${
      post.seller_id
    })" class="post-box border-2 mb-4 border-light-black rounded-3xl overflow-hidden">
    <img class="max-h-24 w-full object-cover" src="./src/media/posted/${
      post.image_name
    }" alt="image of sold food" />
    <div class="post-content-wrapper mx-3">
      <div class="flex justify-between mt-2">
        <span class="food-category-badge 
        ${
          post.category == "Fruits & Vegetables" ? "bg-light-green-custom" : ""
        } ${post.category == "Dish" ? "bg-light-blue" : ""}
        ${post.category == "Bread & Pastry" ? "bg-light-orange" : ""} ${
      post.category == "Dessert" ? "bg-light-violet" : ""
    }
        ${post.category == "Diary" ? "bg-light-red" : ""}">${
      post.category
    }</span>
        <div class="flex">
        <img class="pr-1 w-6 h-6 object-cover object-center rounded-full" src="./src/media/profile/${
          post.seller_image
        }" alt="" />
        <p>${post.seller_username}</p>
        </div>
      </div>
      <div class="flex justify-between font-bold mt-4">
        <p>${post.product_name}</p>
        <p>DKK ${post.price}</p>
      </div>
      <div class="flex justify-between mt-1 mb-4 opacity-50 text-xs">
        <p>Amount ${post.amount}</p>
        <p>Expires: ${post.expires_in}</p>
      </div>
    </div>
  </article>
    `;
    document.querySelector("#posts-feed-container").innerHTML += htnlTemplate;
  }
  console.log("Appended posts", posts);
}

async function search(value) {
  _appliedFilters = [];
  appendCheckedFilter(_appliedFilters);
  resetAllFilters();
  let searchValue = value.toLowerCase();
  let filteredPosts = [];
  const allPosts = await fetchPosts();
  for (let post of allPosts) {
    let name = post.product_name.toLowerCase();
    if (name.includes(searchValue)) {
      filteredPosts.push(post);
    }
  }

  appendPosts(filteredPosts);
}

init();
