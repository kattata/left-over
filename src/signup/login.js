// const baseUrl = "http://localhost:3000/test/backend.php";

const loginEmail = document.querySelector(".login-email");
const loginPassword = document.querySelector(".login-password");
let error = "";

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
  error = result;
  console.log(result);
  if (error.length != "") {
    document.querySelector(".error").innerHTML = error;
  } else {
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
