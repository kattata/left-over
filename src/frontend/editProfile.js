const editProfileUsername = document.querySelector(".edit-profile-name");
const editProfileEmail = document.querySelector(".edit-profile-email");
const editProfilePassword = document.querySelector(".edit-profile-password");
const editProfilePhoneNumber = document.querySelector(
  ".edit-profile-phone-number"
);
const editProfileAddress = document.querySelector(".edit-profile-address");
const editProfileZipCode = document.querySelector(".edit-profile-zip-code");
const editProfileCity = document.querySelector(".edit-profile-city");
const editProfileImg = document.querySelector(".edit-profile-picture");

let editProfileError = "";
let uploadedEditImg = "";
let userId = 0;

editProfileImg.addEventListener("change", (e) => {
  uploadedEditImg = e.target.files[0];
});

async function updateUser() {
  const currentUser = JSON.parse(sessionStorage.getItem("user"));

  const formData = new FormData();
  formData.append("file", uploadedEditImg);
  formData.append("fileSize", uploadedEditImg.size);
  formData.append("currentImg", currentUser.image_name);
  formData.append("id", currentUser.user_id);
  formData.append("name", editProfileUsername.value);
  formData.append("email", editProfileEmail.value);
  formData.append("password", editProfilePassword.value);
  formData.append("phoneNumber", editProfilePhoneNumber.value);
  formData.append("address", editProfileAddress.value);
  formData.append("zipCode", editProfileZipCode.value);
  formData.append("city", editProfileCity.value);

  const response = await fetch(
    "http://localhost:3000/src/backend/updateUser.php?action=updateUser",
    {
      method: "POST",
      body: formData,
    }
  );

  const result = await response.json();
  editProfileError = result[0];
  userId = result[1];
  if (editProfileError != "") {
    document.querySelector(".edit-profile-error").innerHTML = editProfileError;
  } else {
    navigateTo("#/profile");
    updateSession();
  }
}

document.querySelector(".edit-profile-form").addEventListener("submit", (e) => {
  e.preventDefault();
  updateUser();
});

async function updateSession() {
  const response = await fetch("../../src/backend/json/users.json");
  const result = await response.json();
  let userInfo = {};
  for (const user of result) {
    if (user.user_id == userId) {
      userInfo = user;
    }
  }
  sessionStorage.user = JSON.stringify(userInfo);
  window.location.reload();
}
