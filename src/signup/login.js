// const baseUrl = "http://localhost:3000/test/backend.php";

const loginEmail = document.querySelector(".login-email");
const loginPassword = document.querySelector(".login-password");
let error = "";
let userEmail = "";

async function login() {
  const user = {
    email: loginEmail.value,
    password: loginPassword.value,
  };
  const response = await fetch(baseUrl + "?action=login", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(user),
  });
  const result = await response.json();
  error = result[0];
  userEmail = result[1];
  if (error.length != "") {
    document.querySelector(".error").innerHTML = error;
  } else {
    searchForUser();
    navigateTo("#/");
  }
}

document.querySelector(".login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  login();
});

document.querySelector(".go-to-signup").addEventListener("click", (e) => {
  navigateTo("#/signup");
});

let userSessionInfo = {};

async function searchForUser() {
  const response = await fetch("../../test/results2.json");
  const result = await response.json();
  console.log(result);
  let userInfo = {};
  for (const user of result) {
    if (user.email == userEmail) {
      userInfo = user;
    }
  }
  sessionStorage.setItem("userSession", JSON.stringify(userInfo));
  userSessionInfo = JSON.parse(sessionStorage.getItem("userSession"));
  console.log(userSessionInfo.username);
  document.querySelector(".username").innerHTML = userSessionInfo.username;
}

// document.querySelector(".username").innerHTML = JSON.parse(
//   sessionStorage.getItem("userSession").username
// );

function logout() {
  sessionStorage.clear();
  navigateTo("#/login");
}

document.querySelector(".logout").addEventListener("click", () => {
  logout();
});
