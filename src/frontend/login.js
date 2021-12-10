const loginEmail = document.querySelector(".login-email");
const loginPassword = document.querySelector(".login-password");
const profileUsername = document.querySelector(".edit-profile-name");
const profileEmail = document.querySelector(".edit-profile-email");
const profilePassword = document.querySelector(".edit-profile-password");
const profilePhoneNumber = document.querySelector(".edit-profile-phone-number");
const profileAddress = document.querySelector(".edit-profile-address");
const profileZipCode = document.querySelector(".edit-profile-zip-code");
const profileCity = document.querySelector(".edit-profile-city");
const profileImg = document.querySelector(".edit-profile-picture");
// import { appendUserInfoToEditProfile } from "./editProfile";
let loginError = "";
let userEmail = "";
let _posts = "";

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
  userEmail = result[1];
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

document.querySelector(".go-to-signup").addEventListener("click", (e) => {
  navigateTo("#/signup");
});

async function searchForUser() {
  const response = await fetch("../../src/backend/json/users.json");
  const result = await response.json();
  let userInfo = {};
  for (const user of result) {
    // change email to id
    if (user.email == userEmail) {
      userInfo = user;
    }
  }
  sessionStorage.setItem("user", JSON.stringify(userInfo));
  // append user info after log in
  appendUserInfo();
  appendUserInfoToEditProfile(); // this function is in editProfile.js
}

const username = document.querySelector(".profile-username");

async function appendUserInfo() {
  let userSessionInfo = JSON.parse(sessionStorage.getItem("user"));
  // session
  if (userSessionInfo) {
    username.innerHTML = userSessionInfo.username;
  }
  // append posts to profile page
  appendProfilePosts();
  appendUserInfoToEditProfile(userSessionInfo);
}

let userSessionInfo = JSON.parse(sessionStorage.getItem("user"));
// append user info in case of refresh
appendUserInfo();
appendUserInfoToEditProfile(userSessionInfo);

function appendUserInfoToEditProfile(userSession) {
  if (userSession) {
    profileUsername.value = userSession.username;
    profileEmail.value = userSession.email;
    profilePassword.value = userSession.password;
    profilePhoneNumber.value = userSession.phone_number;
    profileAddress.value = userSession.address;
    profileZipCode.value = userSession.zip_code;
    profileCity.value = userSession.city;
    // profileImg.value = userSession.image_name;
  }
}

async function appendProfilePosts() {
  // fetch posts
  const response = await fetch("../../src/backend/json/posts.json");
  const posts = await response.json();
  for (const post of posts) {
    // append posted posts
    if (userSessionInfo && post.seller_id == userSessionInfo.user_id) {
      let html = "";
      html = `
      <article class="post-box border-2 mb-4 border-light-black rounded-3xl overflow-hidden" onclick="openPostDetails(post.post_id)">
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

function logout() {
  sessionStorage.clear();
  navigateTo("#/login");
  window.location.reload();
}

function openPostDetails(postId) {
  navigateTo("#/myPostDetails");
  console.log(postId);

  let html = "";
  html = `
    <div class="container">
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
    </div>
  `;
  document.querySelector(".my-post-details").innerHTML = html;
}
