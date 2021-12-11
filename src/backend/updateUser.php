<?php

$error = "";
require('mysql.php');

$db = new MySQL();
$db->Connect();

// VALIDATION
function allFieldsFilledEdit($username, $email, $phoneNumber, $address, $zipCode, $city) {
    if($username && $email && $phoneNumber && $address && $zipCode && $city) {
        return true;
    } else {
        global $error;
        $error = "Fill out all fields";
        return false;
    }
}

if ($_GET['action'] == 'updateUser') {
    // get user from frontend
    $user = json_decode(file_get_contents("php://input"));
    $id = $user->id;
    $username = $user->name;
    $email = $user->email;
    $phoneNumber = $user->phoneNumber;
    $address = $user->address;
    $zipCode = $user->zipCode;
    $city = $user->city;
    $img = $user->img;

    // validation
    if(allFieldsFilledEdit($username, $email, $phoneNumber, $address, $zipCode, $city)) {
        global $db;
        $results = $db->Query("UPDATE users SET username = '$username', email = '$email', phone_number = '$phoneNumber', address = '$address', zip_code = '$zipCode', city = '$city', image_name = '$img' WHERE user_id = '$id'");
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
        // errors
        global $error;
        $error = "";
        echo json_encode(array($error, $id));
    } else {
        global $error;
        echo json_encode(array($error, $id));
        // echo json_encode($error);    
    }
}

