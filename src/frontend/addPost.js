let _appliedTimeSlots = [];
// function to add checked filters
function filterTimeSlot(value, event) {
  let checkboxValue = value;
  if (event.target.checked === true) {
  }
  if (event.target.checked === true && _appliedTimeSlots.length === 0) {
    //actual array
    _appliedTimeSlots.push(checkboxValue);
  }
  // when there is more elemnts in the return array then one do the check
  // of a clicked product if item is different from any other
  // already in the array add that element to the array
  if (event.target.checked === true && _appliedTimeSlots.length >= 1) {
    for (let i = 0; i < _appliedTimeSlots.length; i++) {
      if (checkboxValue !== _appliedTimeSlots[i]) {
        _appliedTimeSlots.push(checkboxValue);
        // console.log("added filters in if", _appliedTimeSlots, "iterator:", i);
        break;
      } else {
        // console.log("else output", _appliedTimeSlots, "iterator:", i);
      }
    }
  }
  // if the checkbox is unchecked false remove the elemnt form the array
  else if (event.target.checked === false) {
    for (let i = 0; i < _appliedTimeSlots.length; i++) {
      if (checkboxValue === _appliedTimeSlots[i]) {
        _appliedTimeSlots.splice(i, 1);
      }
    }
  }
  // console.log("filters to apply", _appliedTimeSlots);
}
//grab uploaded image
const uploadedImage = document.querySelector("#product-uploaded-image");

let uploadedImg = "";

uploadedImage.addEventListener("change", (e) => {
  uploadedImg = e.target.files[0];
});

const formData = new FormData();
formData.append("file", uploadedImg);

//actual function to send information from frontend to backend
async function createPost() {
  //grab user from seasionStorage
  let userDetails = JSON.parse(sessionStorage.getItem("user"));
  //assign all the data to object
  const currentUser = {
    id: userDetails.user_id,
    name: userDetails.username,
    profileImage: userDetails.image_name,
  };
  //object with post information
  const newPost = {
    sellerId: currentUser.id,
    sellerUsername: currentUser.name,
    sellerImage: currentUser.profileImage,
    productName: document.querySelector("#create-post-product-name").value,
    productAmount: document.querySelector("#create-post-product-amount").value,
    productPrice: document.querySelector("#create-post-product-price").value,
    productCategory: document.querySelector('input[name="product_category"]:checked').value,
    productDiet: document.querySelector('input[name="product_diet"]:checked').value,
    productDescription: document.querySelector("#product_description").value,
    productExpirationDate: document.querySelector("#create-post-product-expiration-date").value,
    reservedDay: document.querySelector("#product-pick-up-day").value,
    reservedTimeSlots: JSON.stringify(_appliedTimeSlots),
  };
  //use FormData() to properly send images and all the data to backend
  const formData = new FormData();
  formData.append("file", uploadedImg);
  formData.append("sellerId", newPost.sellerId);
  formData.append("sellerImage", newPost.sellerImage);
  formData.append("sellerUserName", newPost.sellerUsername);
  formData.append("productName", newPost.productName);
  formData.append("productAmount", newPost.productAmount);
  formData.append("productPrice", newPost.productPrice);
  formData.append("productCategory", newPost.productCategory);
  formData.append("productDiet", newPost.productDiet);
  formData.append("productDescription", newPost.productDescription);
  formData.append("productExpirationDate", newPost.productExpirationDate);
  formData.append("reservedDay", newPost.reservedDay);
  formData.append("reservedTimeSlots", newPost.reservedTimeSlots);
  //fetch call
  await fetch("../../src/backend/addPost.php?action=newPost", {
    method: "POST",
    body: formData,
  });
}
//when the form is submited
document.querySelector("#add-post-form").addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("I work");
  createPost();
  navigateTo("#/");
  window.location.reload();
});
