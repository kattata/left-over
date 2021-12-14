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
        
        // update image in posts
        $db->Query("UPDATE posts SET seller_image = '$imgName' WHERE seller_id = '$id'");
        // fetch users data from db
        $allPosts = $db->Query("SELECT * FROM posts");
        $postsJsonArray = array();
        foreach ($allPosts as $result) {
            $postsArray = array(
                "post_id" => $result["post_id"],
                "seller_id" => $result["seller_id"],
                "buyer_id" => $result["buyer_id"],
                "created_at" => $result["created_at"],
                "product_name" => $result["product_name"],
                "amount" => $result["amount"],
                "price" => $result["price"],
                "expires_in" => $result["expires_in"],
                "category" => $result["category_name"],
                "diet" => $result["diet_name"],
                "image_name" => $result["image_name"],
                "description" => $result["product_description"],
                "seller_image" => $result["seller_image"],
                "seller_username" => $result["seller_username"],
            );
            array_push($postsJsonArray, $postsArray);
        }
        $fp = fopen('posts.json', 'w');
        fwrite($fp, json_encode($postsJsonArray));
        fclose($fp);
        $source = "posts.json";
        $destination = "./json/posts.json";
        rename($source, $destination) ? "OK" : "ERROR";
        // update image in transaction
        $db->Query("UPDATE Transactions SET seller_image = '$imgName' WHERE seller_id = '$id'");
        
        $TransactionArray = $db->Query("SELECT * FROM Transactions");
        $TransactionJsonArray = array();
        foreach ($TransactionArray as $result) {
            $transactionsArray = array(
                "transaction_id" => $result["transaction_id"],
                "post_id" => $result["post_id"],
                "seller_id" => $result["seller_id"],
                "seller_username" => $result["seller_username"],
                "buyer_id" => $result["buyer_id"],
                "buyer_username" => $result["buyer_username"],
                "product_name" => $result["product_name"],
                "amount" => $result["amount"],
                "price" => $result["price"],
                "address" => $result["address"],
                "zip_code" => $result["zip_code"],
                "city" => $result["city"],
                "collection_day" => $result["collection_day"],
                "phone_number" => $result["phone_number"],
                "time_slot" => $result["time_slot"],
                "seller_image" => $result["seller_image"],
                "post_image" => $result["post_image"],
                "category" => $result["category"],
                "expires_in" => $result["expires_in"],
            );
            array_push($TransactionJsonArray, $transactionsArray);
            }
            $fp3 = fopen('transactions.json', 'w');
            fwrite($fp3, json_encode($TransactionJsonArray));
            fclose($fp3);
            $source3 = "transactions.json";
            $destination3 = "./json/transactions.json";
            rename($source3, $destination3) ? "OK" : "ERROR" ;
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

