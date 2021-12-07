const baseUrl = "http://localhost:3000/test/backend.php";

const username = document.querySelector(".name");
const email = document.querySelector(".email");
const password = document.querySelector(".password");
const rptPassword = document.querySelector(".rpt-password");

async function createUser() {
  const newUser = {
    name: username.value,
    email: email.value,
    password: password.value,
    rptPassword: rptPassword.value,
  };
  const response = await fetch(baseUrl + "?action=createUser", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(newUser),
  });
  const result = response.json();
  console.log(result);
}

document.querySelector(".signup-form").addEventListener("submit", (e) => {
  e.preventDefault();
  createUser();
});
