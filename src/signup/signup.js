const baseUrl = "http://localhost:3000/test/backend.php";

const username = document.querySelector(".name").value;
const email = document.querySelector(".email");
const password = document.querySelector(".password");
const rptPassword = document.querySelector(".rpt-password");

async function createUser(e) {
  e.preventDefault();
  console.log(username);
  //   const newUser = {
  //     username,
  //     email,
  //     password,
  //   };
  //   const response = await fetch(baseUrl + "?action=createUser", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json; charset=utf-8" },
  //     body: JSON.stringify(newUser),
  //   });
  //   const result = response.json();
  //   console.log(result);
}
