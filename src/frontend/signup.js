const signupUsername = document.querySelector(".signup-name");
const signupEmail = document.querySelector(".signup-email");
const signupPassword = document.querySelector(".signup-password");
const signupRptPassword = document.querySelector(".signup-rpt-password");
const signupPhoneNumber = document.querySelector(".signup-phone-number");
const signupAddress = document.querySelector(".signup-address");
const signupZipCode = document.querySelector(".signup-zip-code");
const signupCity = document.querySelector(".signup-city");
const signupImg = document.querySelector(".signup-picture");

let signupError = "";
let uploadedImgName = "";
let uploadedImg = "";

signupImg.addEventListener("change", (e) => {
  uploadedImgName = e.target.files[0].name;
  uploadedImg = e.target.files[0];
});

async function createUser() {
  const formData = new FormData();
  formData.append("file", uploadedImg);
  formData.append("name", signupUsername.value);
  formData.append("email", signupEmail.value);
  formData.append("password", signupPassword.value);
  formData.append("rptPassword", signupRptPassword.value);
  formData.append("phoneNumber", signupPhoneNumber.value);
  formData.append("address", signupAddress.value);
  formData.append("zipCode", signupZipCode.value);
  formData.append("city", signupCity.value);

  const newUser = {
    name: signupUsername.value,
    email: signupEmail.value,
    password: signupPassword.value,
    rptPassword: signupRptPassword.value,
    phoneNumber: signupPhoneNumber.value,
    address: signupAddress.value,
    zipCode: signupZipCode.value,
    city: signupCity.value,
    img: uploadedImgName,
  };

  // const response = await fetch(
  //   "http://localhost:3000/src/backend/createUser.php?action=createUser",
  //   {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json; charset=utf-8" },
  //     body: JSON.stringify(newUser),
  //   }
  // );
  const response = await fetch(
    "http://localhost:3000/src/backend/createUser.php?action=createUser",
    {
      method: "POST",
      body: formData,
    }
  );
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
