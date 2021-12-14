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
    <img class="max-h-24 w-full object-cover" src="./src/media/posted/${post.image_name}" alt="image of sold food" />
    <div class="post-content-wrapper mx-3">
      <div class="flex justify-between mt-2">
        <span class="food-category-badge 
        ${post.category == "Fruits & Vegetables" ? "bg-light-green-custom" : ""} ${post.category == "Dish" ? "bg-light-blue" : ""}
        ${post.category == "Bread & Pastry" ? "bg-light-orange" : ""} ${post.category == "Dessert" ? "bg-light-violet" : ""}
        ${post.category == "Diary" ? "bg-light-red" : ""}">${post.category}</span>
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
document.addEventListener("DOMContentLoaded", (e)=>{
  setTimeout(()=>{
    splash.classList.add("display-none");
  }, 1000);
})

// SHOPING LIST
const itemToAdd = document.getElementById("itemToAdd");
const productAmount = document.getElementById("productAmount");
const addButton = document.getElementById("addButton");
const itemList = document.getElementById("list");

class Item {
	constructor (itemName, itemAmount) {
		this.name = itemName;
    this.amount = itemAmount;
		this.create();
	}

	create () {
    // let html = "";
    // for (const userObject of usersArray) {
    //     html += /*html*/`
    //         <article>
    //             <img src="${userObject.avatarUrl}" onclick="showDetailView('${userObject.id}')">
    //             <h2>${userObject.name}</h2>
    //             <a href="mailto:${userObject.email}">${userObject.email}</a>
    //             <p>${userObject.enrollmentType.replace("Enrollment", "")}</p>
    //             <p>Course: ${userObject.course}</p>
    //             <button onclick="selectUser('${userObject.id}')">Update</button>
    //             <button onclick="deleteUser('${userObject.id}')">Delete</button>
    //         </article>
    //     `;
    // }
    // document.querySelector("#users-container").innerHTML = html;

		let listItem = document.createElement("div");
		listItem.classList.add("list-item");

    let removeButton = document.createElement("input");
		removeButton.classList.add("remove");
    removeButton.type = "radio";
		removeButton.addEventListener("click", () => this.remove(listItem));

		let input = document.createElement("input");
		input.type = "text";
		input.classList.add("item-name");
    input.value = this.name;
		input.disabled = true;

    let amountInput = document.createElement("input");
    amountInput.type = "text";
    amountInput.classList.add("item-name");
    amountInput.value = this.amount;
    amountInput.disabled = true;

		let actions = document.createElement("div");
		actions.classList.add("item-actions");

		actions.appendChild(removeButton);
    
    listItem.appendChild(actions);
		listItem.appendChild(input);
    listItem.appendChild(amountInput);
		itemList.appendChild(listItem);
	}

	remove (listItem) {
		listItem.parentNode.removeChild(listItem);
	}
}

function newItem () {
	if (itemToAdd.value != "" || productAmount.value != "") {
		new Item(itemToAdd.value, productAmount.value);
		itemToAdd.value = "";
    productAmount.value = "";
	}
}

document.querySelector(".form-shopping").addEventListener("submit", (e) => {
  e.preventDefault();
  newItem();
})