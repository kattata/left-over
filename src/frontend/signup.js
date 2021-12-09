const baseUrl = "http://localhost:3000/src/backend/backend.php";

const signupUsername = document.querySelector(".signup-name");
const signupEmail = document.querySelector(".signup-email");
const signupPassword = document.querySelector(".signup-password");
const signupRptPassword = document.querySelector(".signup-rpt-password");
const signupPhoneNumber = document.querySelector(".signup-phone-number");
const signupAddress = document.querySelector(".signup-address");
const signupZipCode = document.querySelector(".signup-zip-code");
const signupCity = document.querySelector(".signup-city");

let signupError = "";

async function createUser() {
  const newUser = {
    name: signupUsername.value,
    email: signupEmail.value,
    password: signupPassword.value,
    rptPassword: signupRptPassword.value,
    phoneNumber: signupPhoneNumber.value,
    address: signupAddress.value,
    zipCode: signupZipCode.value,
    city: signupCity.value,
  };
  const response = await fetch(baseUrl + "?action=createUser", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(newUser),
  });
  const result = await response.json();
  console.log(result);
  signupError = result;
  if (signupError.length != "") {
    document.querySelector(".signup-error").innerHTML = signupError;
  } else {
    navigateTo("#/login");
  }
}

document.querySelector(".signup-form").addEventListener("submit", (e) => {
  e.preventDefault();
  createUser();
});
