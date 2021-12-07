<?php

$error = "";
require('mysql.php');

$jsonFile = file_get_contents("users.json");
$users = json_decode($jsonFile);
$db = new MySQL();
$db->Connect();


// VALIDATION
function passwordsMatch($password, $rptPassword) {
    if($password === $rptPassword) {
        return true;
    } else {
        global $error;
        $error = "Passwords don't match";
        return false;
    }
}

function allFieldsFilled($username, $email, $password, $rptPassword) {
    if($username && $email && $password && $rptPassword) {
        return true;
    } else {
        global $error;
        $error = "Fill out all fields";
        return false;
    }
}

function userIsUnique($email) {
    global $db;
    $results = $db->Query("SELECT * FROM users WHERE email = '$email'");
    $databaseEmail = "";
    foreach($results as $result) {
        global $databaseEmail;
        $databaseEmail = $result['email'];
    }
    if($databaseEmail == "") {
        return true;
    } else {
        global $error;
        $error = "User already exists";
        return false;
    }
}

// GET USERS
if ($_GET['action'] == 'getUsers') {
    global $db;
    $results = $db->Query('SELECT * FROM users');
    foreach($results as $result) {
        echo $result['username'];
    }
    
    // CREATE USER
} else if ($_GET['action'] == 'createUser') {
    // get user from frontend
    $newUser = json_decode(file_get_contents("php://input"));
    $username = $newUser->name;
    $email = $newUser->email;

    // hash the passwords
    $password = $newUser->password;
    $hashPassword = password_hash($password, PASSWORD_DEFAULT);
    $rptPassword = $newUser->rptPassword;

    // validation
    if(passwordsMatch($password, $rptPassword) && allFieldsFilled($username, $email, $password, $rptPassword) && userIsUnique($email)) {
        global $db;
        $results = $db->Query("INSERT INTO users (username, email, password) VALUES ('$username', '$email', '$hashPassword')");
        echo json_encode($results);
    } else {
        global $error;
        echo json_encode($error);
    }
} else if ($_GET['action'] == 'login') {
    // get user from frontend
    $user = json_decode(file_get_contents("php://input"));
    $enteredEmail = $user->email;
    $enteredPassword = $user->password;

    // select entered email from database
    global $db;
    $results = $db->Query("SELECT * FROM users WHERE email = '$enteredEmail'");
    echo $db->error;

    // save email and password from database into variables
    $databaseEmail;
    $databasePassword;
    foreach($results as $result) {
        global $databaseEmail;
        global $databasePassword;
        $databaseEmail = $result['email'];
        $databasePassword = $result['password'];
    }

    // if password from database and entered password match
    if(password_verify($enteredPassword, $databasePassword)) {
        $error = "Correct password. Welcome!";
        echo json_encode($error);
        return $error;
    } else {
        $error = "Wrong password. Try again";
        echo json_encode($error);
        return $error;
    }
}

// $results1 = $db->Query("SELECT * FROM users");
// $array = array(
//     'name' => 'text'
// );

// foreach ($results1 as $result) {
//     echo $result["username"];
//     echo "<br/>";
//     array_push($array['name'] = $result['username']);
// }
// var_dump($array);
// $fp = fopen('results.json', 'w');
// fwrite($fp, json_encode($array, JSON_FORCE_OBJECT));
// fclose($fp);

// if ($_GET['test2'] == 'Create user') {
//     $results2 = $db->Query("INSERT INTO users (name, email) VALUES ('form', 'works')");
//     // header("location: ../index.html");
// }
