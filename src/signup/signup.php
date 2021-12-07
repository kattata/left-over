
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Test</title>
    </head>
    <body>
      <form onsubmit="createUser()">
          <label>Name</label>
          <input type="text" placeholder="Enter name" class="name">
          <label>Email</label>
          <input type="text" placeholder="Enter email" class="email">
          <label>Password</label>
          <input type="text" placeholder="Enter password" class="password">
          <label>Repeat password</label>
          <input type="text" placeholder="Repeat password" class="rpt-password">
          <button type="submit">Sign up</button>
      </form>

    <script src="service.js"></script>
  </body>
</html>