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
let uploadedEditImgName = "";
let userId = 0;

editProfileImg.addEventListener("change", (e) => {
  uploadedEditImgName = e.target.files[0].name;
});

async function updateUser() {
  const currentUser = JSON.parse(sessionStorage.getItem("user"));
  const user = {
    id: currentUser.user_id,
    name: editProfileUsername.value,
    email: editProfileEmail.value,
    phoneNumber: editProfilePhoneNumber.value,
    address: editProfileAddress.value,
    zipCode: editProfileZipCode.value,
    city: editProfileCity.value,
    img: uploadedEditImgName,
  };
  const response = await fetch(
    "http://localhost:3000/src/backend/updateUser.php?action=updateUser",
    {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(user),
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
    // change email to id
    if (user.user_id == userId) {
      userInfo = user;
    }
  }
  sessionStorage.user = JSON.stringify(userInfo);
  window.location.reload();
}
