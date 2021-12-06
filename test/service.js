const users = [];
const baseUrl = "http://localhost:3000/test/backend.php";

async function getUsers() {
  const response = await fetch(baseUrl + "?action=getUsers");
  const users = await response.json();
  console.log(users);
}

async function createUser() {
  const newUser = {
    username: "Lola",
    email: "lola@gmail.com",
  };
  const response = await fetch(baseUrl + "?action=createUser", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(newUser),
  });
  const result = response.json();
  console.log(result);
}
