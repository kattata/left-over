// login elements
const loginEmail = document.querySelector(".login-email");
const loginPassword = document.querySelector(".login-password");
// edit profile elements
const profileUsername = document.querySelector(".edit-profile-name");
const profileEmail = document.querySelector(".edit-profile-email");
const profilePassword = document.querySelector(".edit-profile-password");
const profilePhoneNumber = document.querySelector(".edit-profile-phone-number");
const profileAddress = document.querySelector(".edit-profile-address");
const profileZipCode = document.querySelector(".edit-profile-zip-code");
const profileCity = document.querySelector(".edit-profile-city");
const profileImg = document.querySelector(".edit-profile-picture");
// profile elements
const username = document.querySelector(".profile-username");
const profilePicture = document.querySelector(".profile-picture");
// global variables
let loginError = "";
let loginUserId = 0;
let _posts = "";

function logout() {
  sessionStorage.clear();
  navigateTo("#/login");
  window.location.reload();
}

async function login() {
  const user = {
    email: loginEmail.value,
    password: loginPassword.value,
  };
  const response = await fetch(
    "http://localhost:3000/src/backend/login.php?action=login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(user),
    }
  );
  const result = await response.json();
  loginError = result[0];
  loginUserId = result[1];
  if (loginError.length > 0) {
    document.querySelector(".login-error").innerHTML = loginError;
  } else {
    searchForUser();
    navigateTo("#/");
  }
}

document.querySelector(".login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  login();
});

async function searchForUser() {
  const response = await fetch("../../src/backend/json/users.json");
  const result = await response.json();
  let userInfo = {};
  for (const user of result) {
    if (user.user_id == loginUserId) {
      userInfo = user;
    }
  }
  // set user in session
  sessionStorage.setItem("user", JSON.stringify(userInfo));
  // append user info after log in
  appendUserInfo();
}

// append user info in case of refresh
appendUserInfo();

// APPEND USER INFO
async function appendUserInfo() {
  // session
  let userSessionInfo = JSON.parse(sessionStorage.getItem("user"));

  if (userSessionInfo) {
    username.innerHTML = userSessionInfo.username;
    profilePicture.src = `src/media/profile/${userSessionInfo.image_name}`;
  }
  appendProfilePosts(userSessionInfo);
  appendToEditProfile(userSessionInfo);
}

// append user info to edit profile
function appendToEditProfile(userSession) {
  if (userSession) {
    profileUsername.value = userSession.username;
    profileEmail.value = userSession.email;
    profilePassword.value = userSession.password;
    profilePhoneNumber.value = userSession.phone_number;
    profileAddress.value = userSession.address;
    profileZipCode.value = userSession.zip_code;
    profileCity.value = userSession.city;
  }
}

// append posts to profile page
async function appendProfilePosts(userSessionInfo) {
  // fetch posts
  const response = await fetch("../../src/backend/json/posts.json");
  const posts = await response.json();
  _posts = posts;

  for (const post of posts) {
    // append posted posts
    if (userSessionInfo && post.seller_id == userSessionInfo.user_id) {
      let html = "";
      html = `
      <article class="post-box border-2 mb-4 border-light-black rounded-3xl overflow-hidden" onclick="openPostDetails(${
        post.post_id
      })">
      <img class="max-h-24 w-full object-cover" src="./src/media/posted/${
        post.image_name
      }" alt="image of sold food" />
      <div class="post-content-wrapper mx-3">
        <div class="flex justify-between mt-2">
          <span class="food-category-badge
          ${
            post.category == "Fruits & Vegetables"
              ? "bg-light-green-custom"
              : ""
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
      document.querySelector(".posted").innerHTML += html;
    }

    // append purchased posts
    if (userSessionInfo && post.buyer_id == userSessionInfo.user_id) {
      let html = "";
      html = `
      <article class="post-box border-2 mb-4 border-light-black rounded-3xl overflow-hidden">
      <img class="max-h-24 w-full object-cover" src="./src/media/posted/${
        post.image_name
      }" alt="image of sold food" />
      <div class="post-content-wrapper mx-3">
        <div class="flex justify-between mt-2">
          <span class="food-category-badge
          ${
            post.category == "Fruits & Vegetables"
              ? "bg-light-green-custom"
              : ""
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
      document.querySelector(".purchased").innerHTML += html;
    }
  }
}

function openPostDetails(postId) {
  navigateTo("#/myPostDetails");
  for (const post of _posts) {
    if (postId == post.post_id) {
      let html = "";
      html = `
    <div class="container">
    <button class="btn-text-green" onclick="navigateTo("#/profile")">Back</button>
    <button class="btn-text-green" onclick="editPost()">Edit</button>
    <button class="btn-text-green" onclick="deletePost(${
      post.post_id
    })">Delete</button>
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
    </div>
  `;
      document.querySelector(".my-post-details").innerHTML = html;
    }
  }
}

function editPost() {
  navigateTo("#/editPost");
}

async function deletePost(postId) {
  const response = await fetch(
    "http://localhost:3000/src/backend/deletePost.php?action=deletePost",
    {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(postId),
    }
  );
  navigateTo("#/profile");
  window.location.reload();
  appendProfilePosts(userSessionInfo);
}
