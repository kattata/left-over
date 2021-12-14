//global variable to find clicked post
let rightPost = undefined;
let rightUser = undefined;
let rightTransaction = undefined;
let rightTimeSlots = [];
//fetching all neccessary data from json
async function fetchTimeSlots() {
  const fetchData = await fetch("../../src/backend/json/time-slots.json")
    .then((res) => res.json())
    .then((data) => {
      return data;
    });

  return fetchData;
}
async function fetchUsers() {
  const fetchData = await fetch("../../src/backend/json/users.json")
    .then((res) => res.json())
    .then((data) => {
      return data;
    });

  return fetchData;
}
async function fetchTransactions() {
  const fetchData = await fetch("../../src/backend/json/transactions.json")
    .then((res) => res.json())
    .then((data) => {
      return data;
    });

  return fetchData;
}
//establishing the global variables

async function getRightObjects(postId, sellerId) {
  let currentPostId = postId;
  let allPostsJson = await fetchPosts();
  let allTimeSlotsJson = await fetchTimeSlots();
  let allUsersJson = await fetchUsers();
  for (const post of allPostsJson) {
    if (post.post_id == currentPostId) {
      rightPost = post;
      rightPost;
    }
  }
  for (const user of allUsersJson) {
    if (user.user_id == sellerId) {
      rightUser = user;
      rightUser;
    }
  }
  for (const timeSlot of allTimeSlotsJson) {
    if (timeSlot.post_id == currentPostId) {
      rightTimeSlots.push(timeSlot);
      rightTimeSlots;
    }
  }
  console.log(rightPost);
}
//function that works similar to create post but combining all the data from json to one transaction
async function createTransactin() {
  let userDetails = JSON.parse(sessionStorage.getItem("user"));
  const loggedUser = {
    id: userDetails.user_id,
    name: userDetails.username,
    profileImage: userDetails.image_name,
  };

  const newTransaction = {
    buyerId: loggedUser.id,
    buyerUsername: loggedUser.name,
    sellerId: rightPost.seller_id,
    sellerUsername: rightPost.seller_username,
    sellerImage: rightPost.seller_image,
    soldProduct: rightPost.product_name,
    timeSlot: document.querySelector('input[name="buy-product-radio"]:checked').value,
    amount: rightPost.amount,
    price: rightPost.price,
    address: rightUser.address,
    zip_code: rightUser.zip_code,
    city: rightUser.city,
    phone_number: rightUser.phone_number,
    collection_date: rightTimeSlots[0].day,
    category: rightPost.category,
    expiresIn: rightPost.expires_in,
    imageName: rightPost.image_name,
  };
  const transactionData = new FormData();
  transactionData.append("ts-postId", rightPost.post_id);
  transactionData.append("ts-buyerId", newTransaction.buyerId);
  transactionData.append("ts-buyerUsername", newTransaction.buyerUsername);
  transactionData.append("ts-sellerId", newTransaction.sellerId);
  transactionData.append("ts-sellerUsername", newTransaction.sellerUsername);
  transactionData.append("ts-amount", newTransaction.amount);
  transactionData.append("ts-product_name", newTransaction.soldProduct);
  transactionData.append("ts-price", newTransaction.price);
  transactionData.append("ts-address", newTransaction.address);
  transactionData.append("ts-zip_code", newTransaction.zip_code);
  transactionData.append("ts-city", newTransaction.city);
  transactionData.append("ts-collection_date", newTransaction.collection_date);
  transactionData.append("ts-phone_number", newTransaction.phone_number);
  transactionData.append("ts-time_slot", newTransaction.timeSlot);
  transactionData.append("ts-category", newTransaction.category);
  transactionData.append("ts-seller_image", newTransaction.sellerImage);
  transactionData.append("ts-image_name", newTransaction.imageName);
  transactionData.append("ts-expires_in", newTransaction.expiresIn);
  await fetch("../../src/backend/addPost.php?action=newTransaction", {
    method: "POST",
    body: transactionData,
  });
  appendTransactionDetails();
  navigateTo("#/mobilePay");
  setTimeout(() => {
    navigateTo("#/summary");
  }, 700);
}
//appenind the summary page
async function appendTransactionDetails() {
  let allTransactionsJson = await fetchTransactions();
  for (const transaction of allTransactionsJson) {
    if (rightPost.post_id === transaction.post_id) {
      rightTransaction = transaction;
    }
  }
  document.querySelector("#purchase-summary").innerHTML = "";
  let htnlTemplate = `
  <h2>Summary</h2>
  <article class="flex flex-col mt-6">
    <div class="flex justify-between border-b-1 border-light-green-custom pb-4">
      <p class="font-bold">Product</p>
      <p>${rightTransaction.product_name}</p>
    </div>
    <div class="flex justify-between border-b-1 border-light-green-custom py-4">
    <p class="font-bold">Amount</p>
    <p>${rightTransaction.amount}</p>
  </div>
  <div class="flex justify-between border-b-1 border-light-green-custom py-4">
  <p class="font-bold">Price</p>
  <p>${rightTransaction.price}</p>
</div>
<div class="flex justify-between border-b-1 border-light-green-custom py-4">
<p class="font-bold">Seller</p>
<p>${rightTransaction.seller_username}</p>
</div>
<div class="flex justify-between border-b-1 border-light-green-custom py-4">
<p class="font-bold">Location</p>
<p>${rightTransaction.address}, ${rightTransaction.zip_code} ${rightTransaction.city}</p>
</div>
<div class="flex justify-between border-b-1 border-light-green-custom py-4">
<p class="font-bold">Phone number</p>
<p>${rightTransaction.phone_number}</p>
</div>
<div class="flex justify-between border-b-1 border-light-green-custom py-4">
<p class="font-bold">Collection day</p>
<p>${rightTransaction.collection_day}</p>
</div>
<div class="flex justify-between border-b-1 border-light-green-custom py-4">
<p class="font-bold">Collection time</p>
<p>${rightTransaction.time_slot}</p>
</div> 
 <button  onclick="goToBrowse()" class="btn-primary mt-8 self-center">Continue browsing</button>
  </article>

    `;
  document.querySelector("#purchase-summary").innerHTML = htnlTemplate;
}
function goToBrowse() {
  navigateTo("#/");
  window.location.reload();
}
//append the buy product page
function appendBuyProduct() {
  let htmlForTimeSlots = ``;
  for (const bookedSlot of rightTimeSlots) {
    htmlForTimeSlots += `
    <input id="product_time-slot-${bookedSlot.collectionTime_id}" type="radio" name="buy-product-radio" value="${bookedSlot.timeSlot}" hidden />
    <label class="btn-secondary inline-block mb-2 mr-1 transition-colors duration-200" for="product_time-slot-${bookedSlot.collectionTime_id}">${bookedSlot.timeSlot}</label>
    `;
  }
  document.querySelector("#buy-product").innerHTML = "";
  let htnlTemplate = `
  <p class=" mt-4">You are buying</p>
  <h2 class="">${rightPost.product_name}</h2>
  <article class="flex flex-col">
    <div class="flex justify-between mt-6">
    <span class="food-category-badge 
    ${rightPost.category == "Fruits & Vegetables" ? "bg-light-green-custom" : ""} ${rightPost.category == "Dish" ? "bg-light-blue" : ""}
    ${rightPost.category == "Bread & Pastry" ? "bg-light-orange" : ""} ${rightPost.category == "Dessert" ? "bg-light-violet" : ""}
    ${rightPost.category == "Diary" ? "bg-light-red" : ""}">${rightPost.category}</span>
      <span class="text-xs opacity-50 font-bold">Expires: ${rightPost.expires_in}</span>
    </div>
    <img class="max-h-36 rounded-3xl mt-4 w-full object-cover" src="./src/media/posted/${rightPost.image_name}" alt="image of sold food" />
    <div class="flex justify-between font-bold pt-4 pb-2 border-b-1 border-light-green-custom">
      <p class="text-lg">Amount ${rightPost.amount}</p>
      <p class="text-lg">DKK ${rightPost.price}</p>
    </div>
    <div class="flex justify-between  pt-2 items-center">
      <div class="flex items-center">
        <img class="seller-img" src="./src/media/profile/${rightPost.seller_image}"><p class="text-sm pl-1">${rightPost.seller_username}</p>
      </div>
      <p class="text-sm">${rightUser.city}</p>
    </div>
    <h4 class="mt-6">Choose collection time</h4>
    <label class="form-label" for="product_categories">${rightTimeSlots[0].day}</label>
    <div id="buy-product-wrapper">
    ${htmlForTimeSlots}
    </div>
    <button onclick="createTransactin()" class="btn-primary mt-8 self-center">GO TO PAYMENT</button>
    <p class="text-center w-2/3 self-center mt-2 opacity-50">Full pick up address will be revealed after payment</p>
  </article>
    `;
  document.querySelector("#buy-product").innerHTML += htnlTemplate;
}
//function called when the post is being clicked
async function appendPostDetails(postId, sellerId) {
  await getRightObjects(postId, sellerId);
  document.querySelector("#post-details-before-purchase").innerHTML = "";
  let htnlTemplate = `
  <h2 class=" mt-4">${rightPost.product_name}</h2>
  <article class="flex flex-col">
    <div class="flex justify-between mt-6">
    <span class="food-category-badge 
    ${rightPost.category == "Fruits & Vegetables" ? "bg-light-green-custom" : ""} ${rightPost.category == "Dish" ? "bg-light-blue" : ""}
    ${rightPost.category == "Bread & Pastry" ? "bg-light-orange" : ""} ${rightPost.category == "Dessert" ? "bg-light-violet" : ""}
    ${rightPost.category == "Diary" ? "bg-light-red" : ""}">${rightPost.category}</span>
      <span class="text-xs opacity-50 font-bold">Expires: ${rightPost.expires_in}</span>
    </div>
    <img class="max-h-36 rounded-3xl mt-4 w-full object-cover" src="./src/media/posted/${rightPost.image_name}" alt="image of sold food" />
    <div class="flex justify-between font-bold pt-4 pb-2 border-b-1 border-light-green-custom">
      <p class="text-lg">Amount ${rightPost.amount}</p>
      <p class="text-lg">DKK ${rightPost.price}</p>
    </div>
    <div class="flex justify-between  pt-2 items-center">
      <div class="flex items-center">
        <img class="seller-img" src="./src/media/profile/${rightPost.seller_image}"><p class="text-sm pl-1">${rightPost.seller_username}</p>
      </div>
      <p class="text-sm">${rightUser.city}</p>
    </div>
    <p class="pt-6">${rightPost.description}</p>
    <button onclick="navigateTo('#/buyProduct')" class="btn-primary mt-8 self-center">Buy</button>
  </article>
    `;
  document.querySelector("#post-details-before-purchase").innerHTML += htnlTemplate;
  appendBuyProduct();
}
