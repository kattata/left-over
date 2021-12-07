const baseUrl = "http://localhost:3000/test/backend.php";

const email = document.querySelector(".login-email");
const password = document.querySelector(".login-password");

async function login() {
  const user = {
    email: email.value,
    password: password.value,
  };
  const response = await fetch(baseUrl + "?action=login", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(user),
  });
  const result = response.json();
  console.log(result);
}

document.querySelector(".login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  login();
});
