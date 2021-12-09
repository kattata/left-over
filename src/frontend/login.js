// const baseUrl = "http://localhost:3000/test/backend.php";

const loginEmail = document.querySelector(".login-email");
const loginPassword = document.querySelector(".login-password");
let loginError = "";
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
  console.log(result);
  loginError = result[0];
  userEmail = result[1];
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

document.querySelector(".go-to-signup").addEventListener("click", (e) => {
  navigateTo("#/signup");
});

let userSessionInfo = {};

async function searchForUser() {
  const response = await fetch("../../src/backend/json/users.json");
  const result = await response.json();
  console.log(result);
  let userInfo = {};
  for (const user of result) {
    // change email to id
    if (user.email == userEmail) {
      userInfo = user;
    }
  }
  sessionStorage.setItem("user", JSON.stringify(userInfo));
  // append user info after log in
  appendUserInfo();
}

function appendUserInfo() {
  userSessionInfo = JSON.parse(sessionStorage.getItem("user"));
  document.querySelector(".username").innerHTML +=
    " " + userSessionInfo.username;
}

// append user info in case of refresh
appendUserInfo();

function logout() {
  sessionStorage.clear();
  navigateTo("#/login");
  window.location.reload();
}
