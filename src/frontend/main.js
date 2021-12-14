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
    <article class="post-box border-2 mb-4 border-light-black rounded-3xl overflow-hidden">
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
          <img class=" pr-1" src="./src/media/posted/avatar-test.png" alt="" />
          <p>Piotr Pospiech</p>
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

// SPLASH SCREEN
const splash = document.querySelector(".splash");
document.addEventListener("DOMContentLoaded", (e) => {
  setTimeout(() => {
    splash.classList.add("display-none");
  }, 1000);
});

// SHOPING LIST
const itemToAdd = document.getElementById("itemToAdd");
const productAmount = document.getElementById("productAmount");
const productUnit = document.getElementById("productUnit");
const addButton = document.getElementById("addButton");
const itemList = document.getElementById("list");

let shoppingListItems = [];

function addShoppingListItem() {
  itemList.innerHTML = "";
  let htmlShoppingListTemplate = ``;
  shoppingListItems.push({
    itemId: Date.now(),
    productName: itemToAdd.value,
    productAmount: productAmount.value,
    productUnit: productUnit.value,
  });
  for (const shoppingListItem of shoppingListItems) {
    htmlShoppingListTemplate = `
      <div class="flex items-center justify-between form-input mb-3" >
        <div class=" flex items-center">
          <input onClick="removeItem(${shoppingListItem.itemId})" class=" mr-2" type="radio" name="discard-item">
          <p>${shoppingListItem.productName}</p>
        </div>
        <p>${shoppingListItem.productAmount} ${shoppingListItem.productUnit}</p>
      </div>
      
    `;
    itemList.innerHTML += htmlShoppingListTemplate;
  }
}
function removeItem(clickedItemId) {
  console.log(clickedItemId);
  for (let index = 0; index < shoppingListItems.length; index++) {
    const element = shoppingListItems[index];
    if (element.itemId == clickedItemId) {
      shoppingListItems.splice(index, 1);
      updateList(shoppingListItems);
    }
  }
}

function updateList(updatedShoppingList) {
  itemList.innerHTML = "";
  let htmlShoppingListTemplate = ``;
  for (const shoppingListItem of updatedShoppingList) {
    htmlShoppingListTemplate = `
      <div class="flex items-center justify-between form-input mb-3" >
        <div class=" flex items-center">
          <input onClick="removeItem(${shoppingListItem.itemId})" class=" mr-2" type="radio" name="discard-item">
          <p>${shoppingListItem.productName}</p>
        </div>
        <p class=" opacity-70">${shoppingListItem.productAmount} ${shoppingListItem.productUnit}</p>
      </div>
    `;
    itemList.innerHTML += htmlShoppingListTemplate;
  }
}

document.querySelector(".form-shopping").addEventListener("submit", (e) => {
  e.preventDefault();
  addShoppingListItem();
});