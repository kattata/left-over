<?php

$error = "";
require('mysql.php');

$db = new MySQL();
$db->Connect();

// VALIDATION
function allFieldsFilledEdit($productName, $amount, $price, $expirationDate, $description, $collectionDay, $collectionTime, $category, $diet, $imgName) {
    if($productName && $amount && $price && $expirationDate && $description && $collectionDay && $collectionTime && $category && $diet && $imgName) {
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

if ($_GET['action'] == 'updatePost') {
    $postId = $_POST['postId'];
    $productName = $_POST['productName'];
    $amount = $_POST['amount'];
    $price = $_POST['price'];
    $expirationDate = $_POST['expirationDate'];
    $description = $_POST['description'];
    $collectionDay = $_POST['collectionDay'];
    $collectionTime = $_POST['collectionTime'];
    $category = $_POST['category'];
    $diet = $_POST['diet'];
    $sellerUsername = $_POST['sellerUsername'];
    $sellerImage = $_POST['sellerImage'];
    
    $targetFolder = "../media/posted/";
    $imgName = $_FILES['file']['name'];
    $fileName = basename($imgName);
    $allowedMaxFileSize = 1024 * 1024 * 5;
    $imgSize = $_POST['fileSize'];

    global $db;

    if(allFieldsFilledEdit($productName, $amount, $price, $expirationDate, $description, $collectionDay, $collectionTime, $category, $diet, $imgName) && correctFileSize($allowedMaxFileSize, $imgSize)) {

        // insert post
        $updatePosts = $db->Query("UPDATE posts SET product_name = '$productName', amount = '$amount', price = '$price', expires_in = '$expirationDate', product_description = '$description', category_name = '$category', diet_name = '$diet', image_name = '$imgName' WHERE post_id = '$postId'");
        // fetch users data from db
        $allPosts = $db->Query("SELECT * FROM posts");
        
        $postsJsonArray = array();
        
        // delete old time slots
        $db->Query("DELETE FROM Collection_time WHERE post_id = $postId");
        
        // // insert time slots
        $timeSlotsArray = json_decode($collectionTime, true);
        foreach( $timeSlotsArray as $timeSlot) {
            $insertCollectionTime = $db->Query("INSERT INTO Collection_time (day, timeSlot, post_id)
            VALUES ('$collectionDay', '$timeSlot', '$postId')");
        }
        
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
            
            $timeSlotsJsonArray = array();
            $allCollectionTimes = $db->Query("SELECT * FROM Collection_time");
            foreach ($allCollectionTimes as $timeSlot) {
                $timeSlotsArray = array(
                    "post_id" => $timeSlot["post_id"],
                    "collectionTime_id" => $timeSlot["collectionTime_id"],
                    "day" => $timeSlot["day"],
                    "timeSlot" => $timeSlot["timeSlot"]
                
            );
            array_push($timeSlotsJsonArray, $timeSlotsArray);
        }
        
    }

    $fp = fopen('posts.json', 'w');
    fwrite($fp, json_encode($postsJsonArray));
    fclose($fp);
    $source = "posts.json";
    $destination = "./json/posts.json";
    rename($source, $destination) ? "OK" : "ERROR";

    $fp = fopen('time-slots.json', 'w');
    fwrite($fp, json_encode($timeSlotsJsonArray));
    fclose($fp);
    $source = "time-slots.json";
    $destination = "./json/time-slots.json";
    rename($source, $destination) ? "OK" : "ERROR" ;

    // upload image
        move_uploaded_file($_FILES['file']["tmp_name"], $targetFolder . $fileName);
        
        $updatedPost = array(
            "post_id" => $postId,
            "product_name" => $productName,
            "amount" => $amount,
            "price" => $price,
            "expires_in" => $expirationDate,
            "category" => $category,
            "diet" => $diet,
            "image_name" => $imgName,
            "description" => $description,
            "seller_image" => $sellerImage,
            "seller_username" => $sellerUsername,
        );
        // echo json_encode($updatedPost);
        global $error;
        $error = "";
        echo json_encode(array($error, $updatedPost));
        } else {
            global $error;
            echo json_encode(array($error, $updatedPost));
        }
}