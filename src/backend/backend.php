<?php

$error = "";
require('mysql.php');
// require('../signup/user.php');

// $jsonFile = file_get_contents("users.json");
// $users = json_decode($jsonFile);
$db = new MySQL();
$db->Connect();


// SIGNUP VALIDATION
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

// LOGIN VALIDATION
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
        $fp = fopen('users2.json', 'w');
        fwrite($fp, json_encode($usersJson,));
        fclose($fp);
        $source = "users2.json";
        $destination = "./json/users2.json";
        rename($source, $destination) ? "OK" : "ERROR" ;
        global $error;
        $error = "";
        echo json_encode($error);
    } else {
        global $error;
        echo json_encode($error);
    }

// LOGIN
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

    // check is user exists and the password matches
    if(userExists($enteredEmail) && verifyPassword($enteredPassword, $databasePassword)) {
        global $error;
        $error = "";
        $response = json_encode(array($error, $enteredEmail));
        echo $response;
    } else {
        global $error;
        echo json_encode($error);
    }


// UPDATE USER
} else if ($_GET['action'] == 'updateUser') {
    // get user from frontend
    $newUser = json_decode(file_get_contents("php://input"));
    $username = $newUser->name;
    $email = $newUser->email;
    $phoneNumber = $newUser->phoneNumber;
    $address = $newUser->address;
    $zipCode = $newUser->zipCode;
    $city = $newUser->city;

    // validation
    if(allFieldsFilledEdit($username, $email, $phoneNumber, $address, $zipCode, $city)) {
        global $db;
        $results = $db->Query("UPDATE users SET 
        username = '$username',
        email = '$email',
        phone_number = '$phoneNumber',
        address = '$address',
        zip_code = '$zipCode',
        city = '$city' 
        WHERE email = '$email'");
        global $error;
        $error = "";
        echo json_encode($error);
        echo $db->error;
    } else {
        global $error;
        echo json_encode($error);    
    }
}

