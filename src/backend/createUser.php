<?php

$error = "";
require('mysql.php');

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

function allFieldsFilledCreate($username, $email, $password, $rptPassword, $phoneNumber, $address, $zipCode, $city) {
    if($username && $email && $password && $rptPassword && $phoneNumber && $address && $zipCode && $city) {
        return true;
    } else {
        global $error;
        $error = "Fill out all fields";
        return false;
    }
}

function allFieldsFilledEdit($username, $email, $phoneNumber, $address, $zipCode, $city) {
    if($username && $email && $phoneNumber && $address && $zipCode && $city) {
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

if ($_GET['action'] == 'createUser') {
    // get user from frontend
    $newUser = json_decode(file_get_contents("php://input"));
    $username = $newUser->name;
    $email = $newUser->email;
    $phoneNumber = $newUser->phoneNumber;
    $address = $newUser->address;
    $zipCode = $newUser->zipCode;
    $city = $newUser->city;

    // hash the passwords
    $password = $newUser->password;
    $hashPassword = password_hash($password, PASSWORD_DEFAULT);
    $rptPassword = $newUser->rptPassword;

    // validation
    if(passwordsMatch($password, $rptPassword) && allFieldsFilledCreate($username, $email, $password, $rptPassword, $phoneNumber, $address, $zipCode, $city) && userIsUnique($email)) {
        global $db;
        $results = $db->Query("INSERT INTO users (username, email, password, phone_number, address, zip_code, city) VALUES ('$username', '$email', '$hashPassword', '$phoneNumber', '$address', '$zipCode', '$city')");
        // save users data in db
        $dbResults = $db->Query("SELECT * FROM users");
        $usersJson = array();
        foreach ($dbResults as $result) {
        $users = array(
            "user_id" => $result["user_id"],
            "username" => $result["username"],
            "email" => $result["email"],
            "password" => $result["password"],
            "phone_number" => $result["phone_number"],
            "address" => $result["address"],
            "zip_code" => $result["zip_code"],
            "city" => $result["city"]
        );
        array_push($usersJson, $users);
        }
        $fp = fopen('users.json', 'w');
        fwrite($fp, json_encode($usersJson,));
        fclose($fp);
        $source = "users.json";
        $destination = "./json/users.json";
        rename($source, $destination) ? "OK" : "ERROR" ;
        global $error;
        $error = "";
        echo json_encode($error);
    } else {
        global $error;
        echo json_encode($error);
    }
}