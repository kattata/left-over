const editProfileUsername = document.querySelector(".edit-profile-name");
const editProfileEmail = document.querySelector(".edit-profile-email");
const editProfilePassword = document.querySelector(".edit-profile-password");
const editProfileRptPassword = document.querySelector(
  ".edit-profile-rpt-password"
);
const editProfilePhoneNumber = document.querySelector(
  ".edit-profile-phone-number"
);
const editProfileAddress = document.querySelector(".edit-profile-address");
const editProfileZipCode = document.querySelector(".edit-profile-zip-code");
const editProfileCity = document.querySelector(".edit-profile-city");
const editProfileImg = document.querySelector(".edit-profile-picture");

let editProfileError = "";
let uploadedEditImgName = "";

editProfileImg.addEventListener("change", (e) => {
  uploadedEditImgName = e.target.files[0].name;
});

async function updateUser() {
  const currentUserId = JSON.parse(sessionStorage.getItem("user")).user_id;
  const user = {
    id: currentUserId,
    name: editProfileUsername.value,
    email: editProfileEmail.value,
    phoneNumber: editProfilePhoneNumber.value,
    address: editProfileAddress.value,
    zipCode: editProfileZipCode.value,
    city: editProfileCity.value,
    img: uploadedEditImgName,
  };
  const response = await fetch(
    "http://localhost:3000/src/backend/createUser.php?action=updateUser",
    {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(user),
    }
  );
  const result = await response.json();
  console.log(result);
  editProfileError = result;
  if (editProfileError.length != "") {
    document.querySelector(".edit-profile-error").innerHTML = editProfileError;
  } else {
    navigateTo("#/profile");
  }
}

document.querySelector(".edit-profile-form").addEventListener("submit", (e) => {
  e.preventDefault();
  updateUser();
});
