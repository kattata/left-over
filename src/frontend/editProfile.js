// const baseUrl = "http://localhost:3000/test/backend.php";

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

let editProfileError = "";

async function updateUser() {
  const user = {
    name: editProfileUsername.value,
    email: editProfileEmail.value,
    phoneNumber: editProfilePhoneNumber.value,
    address: editProfileAddress.value,
    zipCode: editProfileZipCode.value,
    city: editProfileCity.value,
  };
  const response = await fetch(baseUrl + "?action=updateUser", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(user),
  });
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
