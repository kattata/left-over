<?php

$error = "";
require('mysql.php');

$db = new MySQL();
$db->Connect();

if ($_GET['action'] == 'updateUser') {
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

