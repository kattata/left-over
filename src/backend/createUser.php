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

function allFieldsFilledCreate($username, $email, $password, $rptPassword, $phoneNumber, $address, $zipCode, $city, $imgName) {
    if($username && $email && $password && $rptPassword && $phoneNumber && $address && $zipCode && $city && $imgName) {
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

function correctFileSize($allowedMaxFileSize, $imgSize) {
    if($imgSize < $allowedMaxFileSize) {
        return true;
    } else {
        global $error;
        $error = "File is too big";
        return false;
    }
}

if ($_GET['action'] == 'createUser') {

    // get user from frontend (form data)
    $username = $_POST['name'];
    $email = $_POST['email'];
    $phoneNumber = $_POST['phoneNumber'];
    $address = $_POST['address'];
    $zipCode = $_POST['zipCode'];
    $city = $_POST['city'];
    $password = $_POST['password'];
    $rptPassword = $_POST['rptPassword'];
    // hash the password
    $hashPassword = password_hash($password, PASSWORD_DEFAULT);

    $targetFolder = "../media/profile/";
    $imgName = $_FILES['file']['name'];
    $fileName = basename($imgName);
    $allowedMaxFileSize = 1024 * 1024 * 5;
    $imgSize = $_POST['fileSize'];

    // // validation
    if(passwordsMatch($password, $rptPassword) && allFieldsFilledCreate($username, $email, $password, $rptPassword, $phoneNumber, $address, $zipCode, $city, $imgName) && userIsUnique($email) && correctFileSize($allowedMaxFileSize, $imgSize)) {
        global $db;
        // push user to db
        $results = $db->Query("INSERT INTO users (username, email, password, phone_number, address, zip_code, city, image_name) VALUES ('$username', '$email', '$hashPassword', '$phoneNumber', '$address', '$zipCode', '$city', '$imgName')");
        // fetch users data from db
        $dbResults = $db->Query("SELECT * FROM users");
        // save users data in json
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
            "city" => $result["city"],
            "image_name" => $result["image_name"]
        );
        array_push($usersJson, $users);
        }
        $fp = fopen('users.json', 'w');
        fwrite($fp, json_encode($usersJson,));
        fclose($fp);
        $source = "users.json";
        $destination = "./json/users.json";
        rename($source, $destination) ? "OK" : "ERROR" ;
        // upload image
        move_uploaded_file($_FILES['file']["tmp_name"], $targetFolder . $fileName);
        // errors
        global $error;
        $error = "";
        echo json_encode($error);
    } else {
        global $error;
        echo json_encode($error);
    }
}

