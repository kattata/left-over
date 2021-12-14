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
<<<<<<< Updated upstream
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
=======
      sessionStorage.setItem("currentPost", JSON.stringify(post));
      appendMyPostDetails(post);
    }
  }
  let postInfo = JSON.parse(sessionStorage.getItem("currentPost"));
  appendToEditPost(postInfo);
  console.log(postInfo);
}

function appendMyPostDetails(post) {
  if (post) {
    let html = "";
    html = `
  <div class="flex justify-between">
  <button onclick="navigateTo('#/profile')" class="btn-text-green flex items-center">
    <img src="./src/media/icons/back-arrow-icon.svg" alt="arrow back" /> Back
  </button>
  <div>
  <button class="btn-text-green mr-2" onclick="editPost(${
    post.post_id
  })">Edit</button>
  <button class="btn-text-green" onclick="deletePost(${
    post.post_id
  })">Delete</button>
  </div>

  </div>
  <h1>${post.product_name}</h1>
  <div class="flex justify-between mb-2 items-center">
  <span class="food-category-badge
  ${post.category == "Fruits & Vegetables" ? "bg-light-green-custom" : ""} ${
      post.category == "Dish" ? "bg-light-blue" : ""
    }
  ${post.category == "Bread & Pastry" ? "bg-light-orange" : ""} ${
      post.category == "Dessert" ? "bg-light-violet" : ""
    }
  ${post.category == "Diary" ? "bg-light-red" : ""}">${post.category}</span>
  <p class="grey-text">Expires: ${post.expires_in}</p>
  </div>
  <img class="max-h-24 w-full object-cover mb-4" src="./src/media/posted/${
    post.image_name
  }" alt="image of sold food" />
  <div class="flex justify-between">
    <p>Amount ${post.amount}</p>
    <p>DKK ${post.price}</p>
  </div>
  <span class="h-px w-full block bg-light-green-custom mt-2 mb-2"></span>
  <div class="flex">
    <img class="seller-img" src="./src/media/profile/${
      post.seller_image
    }" alt="" />
    <p>${post.seller_username}</p>
  </div>
  </div>
  <p class="mt-6">${post.description}</p>
  `;
    document.querySelector(".my-post-details").innerHTML = html;
  }
}

let uploadedEditPostImg = "";

let postInfo = sessionStorage.getItem("currentPost");
appendToEditPost(JSON.parse(postInfo));
appendMyPostDetails(JSON.parse(postInfo));

// edit post
editPostImg.addEventListener("change", (e) => {
  uploadedEditPostImg = e.target.files[0];
});

let editPostError = "";
let updatedPost = "";

async function editPost(postId) {
  let currentPost = JSON.parse(sessionStorage.getItem("currentPost"));
  navigateTo("#/editPost");
  const formData = new FormData();
  formData.append("postId", postId);
  formData.append("file", uploadedEditPostImg);
  formData.append("fileSize", uploadedEditPostImg.size);
  formData.append("productName", editPostName.value);
  formData.append("amount", editPostAmount.value);
  formData.append("price", editPostPrice.value);
  formData.append("expirationDate", editPostExpirationDate.value);
  formData.append("description", editPostDescription.value);
  formData.append(
    "category",
    document.querySelector('input[name="edit_product_category"]:checked').value
  );
  formData.append(
    "diet",
    document.querySelector('input[name="edit_product_diet"]:checked').value
  );
  formData.append("collectionDay", editPostCollectionDay.value);
  formData.append("collectionTime", JSON.stringify(editTimeSlots));
  formData.append("sellerUsername", currentPost.seller_username);
  formData.append("sellerImage", currentPost.seller_image);

  const response = await fetch(
    "../../src/backend/updatePost.php?action=updatePost",
    {
      method: "POST",
      body: formData,
>>>>>>> Stashed changes
    }
  }
}

<<<<<<< Updated upstream
function editPost() {
  navigateTo("#/editPost");
=======
document.querySelector(".edit-post-form").addEventListener("submit", (e) => {
  e.preventDefault();
  let postId = JSON.parse(sessionStorage.getItem("currentPost")).post_id;
  editPost(postId);
});

async function updateCurrentPostSession(currentPost) {
  sessionStorage.currentPost = JSON.stringify(currentPost);
  appendToEditPost(currentPost);
  window.location.reload();
}

function appendToEditPost(postInfo) {
  if (postInfo) {
    editPostName.value = postInfo.product_name;
    editPostAmount.value = postInfo.amount;
    editPostPrice.value = postInfo.price;
    editPostExpirationDate.value = postInfo.expires_in;
    editPostDescription.value = postInfo.description;
    editPostCategory.checked = postInfo.category;
    editPostDiet.checked = postInfo.diet;
    // editPostCollectionDay.value = postInfo.
  }
>>>>>>> Stashed changes
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
