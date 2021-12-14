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
// edit post elements
const editPostName = document.querySelector(".edit-post-product-name");
const editPostAmount = document.querySelector(".edit-post-amount");
const editPostPrice = document.querySelector(".edit-post-price");
const editPostExpirationDate = document.querySelector(
  ".edit-post-expiration-date"
);
const editPostDescription = document.querySelector(".edit-post-description");
const editPostCategory = document.querySelector(
  'input[name="edit_product_category"]'
);
const editPostDiet = document.querySelector('input[name="edit_product_diet"]');
const editPostCollectionDay = document.querySelector(
  'input[name="edit_product_collection_day"]'
);
const editPostCollectionTime = document.querySelector(
  'input[name="edit_product_collection_time"]'
);
const editPostImg = document.querySelector(".edit-post-img");
// global variables
let loginError = "";
let loginUserId = 0;
let _posts = "";

// clear session and logout
function logout() {
  sessionStorage.clear();
  navigateTo("#/login");
  window.location.reload();
}

// send data to backend and login
async function login() {
  const user = {
    email: loginEmail.value,
    password: loginPassword.value,
  };
  const response = await fetch("../../src/backend/login.php?action=login", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(user),
  });
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

// add logged in user to session storage
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
  appendPostedPosts(userSessionInfo);
  appendPurchasedPosts(userSessionInfo);
  appendToEditProfile(userSessionInfo);
}

// append user info to inputs in edit profile
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

// append posts to profile page - posted tab
async function appendPostedPosts(userSessionInfo) {
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
      <img class="max-h-36 w-full object-cover" src="./src/media/posted/${
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
            <img class="seller-img" src="./src/media/profile/${
              post.seller_image
            }" alt="" />
            <p>${post.seller_username}</p>
          </div>
        </div>
        <div class="flex justify-between font-bold mt-4">
          <p>${post.product_name}</p>
          <p>DKK ${post.price}</p>
        </div>
        <div class="flex justify-between mt-1 mb-2 opacity-50 text-xs">
          <p>Amount ${post.amount}</p>
          <p>Expires: ${post.expires_in}</p>
        </div>
      </div>
    </article>
        `;
      document.querySelector(".posted").innerHTML += html;
    }
  }
}

// append posts to profile page - purchased tab
async function appendPurchasedPosts(currentUser) {
  const response = await fetch("../../src/backend/json/transactions.json");
  const purchasedPosts = await response.json();

  // append purchased posts
  for (const post of purchasedPosts) {
    if (currentUser && post.buyer_id == currentUser.user_id) {
      let html = "";
      html = `
    <article class="post-box border-2 mb-4 border-light-black rounded-3xl overflow-hidden">
    <img class="max-h-36 w-full object-cover" src="./src/media/posted/${
      post.post_image
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
        <img class="seller-img" src="./src/media/profile/${
          post.seller_image
        }" alt="" />
        <p>${post.seller_username}</p>
        </div>
      </div>
      <div class="flex justify-between font-bold mt-4">
        <p>${post.product_name}</p>
        <p>DKK ${post.price}</p>
      </div>
      <div class="flex justify-between mt-1 mb-2 opacity-50 text-xs">
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

// open a page with post details and set the data in session storage
function openPostDetails(postId) {
  navigateTo("#/myPostDetails");
  // find the selected post information
  for (const post of _posts) {
    if (postId == post.post_id) {
      sessionStorage.setItem("currentPost", JSON.stringify(post));
      appendMyPostDetails(post);
    }
  }
  let postInfo = JSON.parse(sessionStorage.getItem("currentPost"));
  appendToEditPost(postInfo);
  console.log(postInfo);
}

// append data from session to post details
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
  <h1 class="mt-4">${post.product_name}</h1>
  <div class="flex justify-between mb-4 items-center">
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
  <img class="max-h-36 w-full object-cover mb-4 rounded-3xl" src="./src/media/posted/${
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

// EDIT POST
let uploadedEditPostImg = "";

let postInfo = sessionStorage.getItem("currentPost");
appendToEditPost(JSON.parse(postInfo));
appendMyPostDetails(JSON.parse(postInfo));

editPostImg.addEventListener("change", (e) => {
  uploadedEditPostImg = e.target.files[0];
});

let editPostError = "";
let updatedPost = "";

// send data to backend and display error messages
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
    }
  );
  const result = await response.json();
  editPostError = result[0];
  updatedPost = result[1];
  if (editPostError != "") {
    document.querySelector(".edit-post-profile-error").innerHTML =
      editPostError;
  } else {
    console.log(updatedPost);
    navigateTo("#/myPostDetails");
    updateCurrentPostSession(updatedPost);
  }
}

document.querySelector(".edit-post-form").addEventListener("submit", (e) => {
  e.preventDefault();
  let postId = JSON.parse(sessionStorage.getItem("currentPost")).post_id;
  editPost(postId);
});

// update session with with new data
async function updateCurrentPostSession(currentPost) {
  sessionStorage.currentPost = JSON.stringify(currentPost);
  appendToEditPost(currentPost);
  window.location.reload();
}

// append current data to inputs in edit post
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
}

// delete post
async function deletePost(postId) {
  const response = await fetch(
    "../../src/backend/deletePost.php?action=deletePost",
    {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(postId),
    }
  );
  navigateTo("#/profile");
  window.location.reload();
  appendPostedPosts(userSessionInfo);
  appendPurchasedPosts(userSessionInfo);
}

// select correct filters and push to the array
let editTimeSlots = [];

function filterTimeSlotEdit(value, event) {
  let checkboxValue = value;
  if (event.target.checked === true) {
  }
  if (event.target.checked === true && editTimeSlots.length === 0) {
    //actual array
    editTimeSlots.push(checkboxValue);
    //check clicked ones targets
    _clickedFilters.push(event.target);
  }
  // when there is more elemnts in the return array then one do the check
  // of a clicked product if item is different from any other
  // already in the array add that element to the array
  if (event.target.checked === true && editTimeSlots.length >= 1) {
    for (let i = 0; i < editTimeSlots.length; i++) {
      if (checkboxValue !== editTimeSlots[i]) {
        editTimeSlots.push(checkboxValue);
        _clickedFilters.push(event.target);
        // console.log("added filters in if", editTimeSlots, "iterator:", i);
        break;
      } else {
        // console.log("else output", editTimeSlots, "iterator:", i);
      }
    }
  }
  // if the checkbox is unchecked false remove the elemnt form the array
  else if (event.target.checked === false) {
    for (let i = 0; i < editTimeSlots.length; i++) {
      if (checkboxValue === editTimeSlots[i]) {
        editTimeSlots.splice(i, 1);
      }
    }
  }
  console.log("filters to apply", editTimeSlots);
}
