<?php
    require('mysql.php');

$jsonFile = file_get_contents("users.json");
$users = json_decode($jsonFile);
$db = new MySQL();
$db->Connect();


if ($_GET['action'] == 'getUsers') {
    global $db;
    $results = $db->Query('SELECT * FROM users');
    foreach($results as $result) {
        echo $result['username'];
    }
    
} else if ($_GET['action'] == 'createUser') {
    $newUser = json_decode(file_get_contents("php://input"));
    $username = $newUser->username;
    $email = $newUser->email;
    global $db;
    $results = $db->Query("INSERT INTO users (username, email) VALUES ('$username', '$email')");
}
