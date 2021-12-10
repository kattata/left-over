<?php

$error = "";
require('mysql.php');

$db = new MySQL();
$db->Connect();

// VALIDATION
function allFieldsFilledEdit($username, $email, $phoneNumber, $address, $zipCode, $city, $img) {
    if($username && $email && $phoneNumber && $address && $zipCode && $city && $img) {
        return true;
    } else {
        global $error;
        $error = "Fill out all fields";
        return false;
    }
}

if ($_GET['action'] == 'updateUser') {
    // get user from frontend
    $newUser = json_decode(file_get_contents("php://input"));
    $id = $newUser->id;
    $username = $newUser->name;
    $email = $newUser->email;
    $phoneNumber = $newUser->phoneNumber;
    $address = $newUser->address;
    $zipCode = $newUser->zipCode;
    $city = $newUser->city;
    $img = $newUser->img;

    // validation
    if(allFieldsFilledEdit($username, $email, $phoneNumber, $address, $zipCode, $city, $img)) {
        global $db;
        $results = $db->Query("UPDATE users SET 
        username = '$username',
        email = '$email',
        phone_number = '$phoneNumber',
        address = '$address',
        zip_code = '$zipCode',
        city = '$city'
        image_name = '$img' 
        WHERE user_id = '$id'");
        global $error;
        $error = "";
        echo json_encode($error);
        echo $db->error;
    } else {
        global $error;
        echo json_encode($error);    
    }
}

