<?php

$error = "";
require('mysql.php');

$db = new MySQL();
$db->Connect();

// VALIDATION
function allFieldsFilledEdit($username, $email, $phoneNumber, $address, $zipCode, $city, $imgName) {
    if($username && $email && $phoneNumber && $address && $zipCode && $city && $imgName) {
        return true;
    } else {
        global $error;
        $error = "Fill out all fields";
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

if ($_GET['action'] == 'updateUser') {
    // get user from frontend (form data)
    $id = $_POST['id'];
    $username = $_POST['name'];
    $email = $_POST['email'];
    $phoneNumber = $_POST['phoneNumber'];
    $address = $_POST['address'];
    $zipCode = $_POST['zipCode'];
    $city = $_POST['city'];
    $password = $_POST['password'];
    $currentImg = $_POST['currentImg'];

    $targetFolder = "../media/profile/";
    $imgName = $_FILES['file']['name'];
    $fileName = basename($imgName);
    $allowedMaxFileSize = 1024 * 1024 * 5;
    $imgSize = $_POST['fileSize'];
    
    // validation
    if(allFieldsFilledEdit($username, $email, $phoneNumber, $address, $zipCode, $city, $imgName) && correctFileSize($allowedMaxFileSize, $imgSize)) {
        global $db;
        $results = $db->Query("UPDATE users SET username = '$username', email = '$email', phone_number = '$phoneNumber', address = '$address', zip_code = '$zipCode', city = '$city', image_name = '$imgName' WHERE user_id = '$id'");
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
        echo json_encode(array($error, $id));
    } else {
        global $error;
        echo json_encode(array($error, $id));
    }
}

