<?php
require('mysql.php');


$db = new MySQL();
$db->Connect();



if ($_GET['action'] == 'newPost') {
  // get user from frontend
  $postId =time();
  echo "Post id " . $postId  . "</br>";
  $sellerId = $_POST['sellerId'];
  echo "Seller id " . $sellerId  . "</br>";
  $productName = $_POST['productName'];
  echo "product name " . $productName  . "</br>";
  $productAmount = $_POST['productAmount'];
  echo "product amount " .  $productAmount  . "</br>";
  $productPrice = $_POST['productPrice'];
  echo "product price " .  $productPrice  . "</br>"; 
  $productExpirationDate = $_POST['productExpirationDate'];
  echo "productExpirationDate " .  $productExpirationDate  . "</br>";
  $productCategory = $_POST['productCategory'];
  echo "productCategory " .  $productCategory  . "</br>";
  $productDiet = $_POST['productDiet'];
  echo "productDiet " .  $productDiet  . "</br>";
  $productDescription = $_POST['productDescription'];
  echo "productDescription " .  $productDescription  . "</br>";
  $reservedDay = $_POST['reservedDay'];
  echo "reservedDay " .  $reservedDay  . "</br>";
  $reservedTimeSlots = $_POST['reservedTimeSlots'];
  $sellerImageName = $_POST['sellerImage'];
  echo "sellerImageName " .  $sellerImageName  . "</br>";
  $sellerUserName = $_POST['sellerUserName'];
  echo "sellerUserName " .  $sellerUserName  . "</br>";
  $file = $_FILES['file'];
  $uploadedImageName = $file["name"];
  echo "uploadedImageName " .  $uploadedImageName  . "</br>";

  $targetFolder = "../media/posted/";
  $fileName = basename($file["name"]);
  move_uploaded_file($file["tmp_name"], $targetFolder . $fileName);
 
  $results2 = $db->Query("INSERT INTO posts (post_id, seller_id, product_name, amount, price,
   expires_in, category_name, diet_name, image_name, product_description, seller_image, seller_username)
  VALUES ('$postId', '$sellerId', '$productName', '$productAmount', '$productPrice', '$productExpirationDate',
   '$productCategory', '$productDiet', '$uploadedImageName', '$productDescription', '$sellerImageName', '$sellerUserName')");
 var_dump($db-> error);
  
  $results1 = $db->Query("SELECT * FROM posts");
 
  $postsJsonArray = array();
  $timeSlotsArray = json_decode($reservedTimeSlots, true);
  foreach( $timeSlotsArray as $timeSlot) {
   $results3 = $db->Query("INSERT INTO Collection_time (day, timeSlot, post_id)
    VALUES ('$reservedDay', '$timeSlot', '$postId')");
   
  }
  
  foreach ($results1 as $result) {
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
    $results4 = $db->Query("SELECT * FROM Collection_time");
    foreach ($results4 as $timeSlot) {
      $timeSlotsArray = array(
          "post_id" => $timeSlot["post_id"],
          "collectionTime_id" => $timeSlot["collectionTime_id"],
         "day" => $timeSlot["day"],
         "timeSlot" => $timeSlot["timeSlot"]

      );
      array_push($timeSlotsJsonArray, $timeSlotsArray);
    }
     
}

//   var_dump($usersJsonArray);
  $fp = fopen('posts.json', 'w');
  fwrite($fp, json_encode($postsJsonArray));
  fclose($fp);
  $source = "posts.json";
  $destination = "./json/posts.json";
  echo rename($source, $destination) ? "OK" : "ERROR" ;
   // header("location: ../index.html");
   $fp = fopen('time-slots.json', 'w');
   fwrite($fp, json_encode($timeSlotsJsonArray));
   fclose($fp);
   $source = "time-slots.json";
   $destination = "./json/time-slots.json";
   echo rename($source, $destination) ? "OK" : "ERROR" ;
    // header("location: ../index.html");
}