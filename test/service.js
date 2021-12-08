const users = [];
const baseUrl = "../test/results.json";

async function getUsers() {
  const response = await fetch(baseUrl);
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

// const response = fetch("../test/service.js");
// // const users2 = response.json();
// console.log("users array", response);

let fetchData = fetch("../test/results.json")
  .then((res) => res.json())
  .then((data) => {
    return data;
    console.log(data);
  });
