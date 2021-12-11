<?php

$error = "";
require('mysql.php');

$db = new MySQL();
$db->Connect();

// VALIDATION
function verifyPassword($enteredPassword, $databasePassword) {
    if(password_verify($enteredPassword, $databasePassword)) {
        return true;
    } else {
        global $error;
        $error = "Wrong password. Try again";
        return false;
    }
}

function userExists($email) {
    global $db;
    $results = $db->Query("SELECT * FROM users WHERE email = '$email'");
    $databaseEmail = "";
    foreach($results as $result) {
        global $databaseEmail;
        $databaseEmail = $result['email'];
    }
    if($databaseEmail !== "") {
        return true;
    } else {
        global $error;
        $error = "User doesn't exist";
        return false;
    }
}

if ($_GET['action'] == 'login') {
    // get user from frontend
    $user = json_decode(file_get_contents("php://input"));
    $enteredEmail = $user->email;
    $enteredPassword = $user->password;

    // select entered email from database
    global $db;
    $results = $db->Query("SELECT * FROM users WHERE email = '$enteredEmail'");
    echo $db->error;

    // save email and password from database into variables
    foreach($results as $result) {
        $databaseEmail = $result['email'];
        $databasePassword = $result['password'];
        $databaseId = $result['user_id'];
    }

    // check is user exists and the password matches
    if(userExists($enteredEmail) && verifyPassword($enteredPassword, $databasePassword)) {
        global $error;
        $error = "";
        $response = json_encode(array($error, $databaseId));
        echo $response;
    } else {
        global $error;
        $response = json_encode(array($error, $databaseId));
        echo $response;
    }
}