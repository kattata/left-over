<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Test</title>
  </head>
  <body>
        <input type="submit" value="Log users" name="test" class="input" onclick="getUsers()">
        <input type="submit" value="Create user" name="test" class="input" onclick="createUser()">
    <?php

    require('backend.php');

    ?>
    <script src="service.js"></script>
  </body>
</html>
