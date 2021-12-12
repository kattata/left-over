<?php
require('mysql.php');


$db = new MySQL();
$db->Connect();



if ($_GET['action'] == 'newPost') {
  // get user from frontend
  $postId = $_POST['postId'];
  echo "Post id" . gettype($postId)  . "</br>";
  $sellerId = $_POST['sellerId'];
  echo "Seller id" . $sellerId  . "</br>";
  $productName = $_POST['productName'];
  echo "product name" . $productName  . "</br>";
  $productAmount = $_POST['productAmount'];
  echo "product amount" .  $productAmount  . "</br>";
  $productPrice = $_POST['productPrice'];
  echo "product price" .  $productPrice  . "</br>"; 
  $productExpirationDate = $_POST['productExpirationDate'];
  echo "productExpirationDate" .  $productExpirationDate  . "</br>";
  $productCategory = $_POST['productCategory'];
  echo "productCategory" .  $productCategory  . "</br>";
  $productDiet = $_POST['productDiet'];
  echo "productDiet" .  $productDiet  . "</br>";
  $productDescription = $_POST['productDescription'];
  echo "productDescription" .  $productDescription  . "</br>";
  $reservedDay = $_POST['reservedDay'];
  echo "reservedDay" .  $reservedDay  . "</br>";
  $reservedTimeSlots = $_POST['reservedTimeSlots'];
  $sellerImageName = $_POST['sellerImage'];
  echo "sellerImageName" .  $sellerImageName  . "</br>";
  $sellerUserName = $_POST['sellerUserName'];
  echo "sellerUserName" .  $sellerUserName  . "</br>";
  $file = $_FILES['file'];
  $uploadedImageName = $file["name"];
  echo "uploadedImageName" .  $uploadedImageName  . "</br>";

  $targetFolder = "../media/posted/";
  $fileName = basename($file["name"]);
  move_uploaded_file($file["tmp_name"], $targetFolder . $fileName);
 
  $results2 = $db->Query("INSERT INTO posts (post_id, seller_id, product_name, amount, price,
   expires_in, category_name, diet_name, image_name, product_description, seller_image, seller_username)
  VALUES ('$postId', '1', 'test', '1', '2', '20-10-1999',
   'fafsd', 'test', 'test', 'test', 'fff', 'fff')");
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

}

//   var_dump($usersJsonArray);
  $fp = fopen('posts.json', 'w');
  fwrite($fp, json_encode($postsJsonArray));
  fclose($fp);
  $source = "posts.json";
  $destination = "./json/posts.json";
  echo rename($source, $destination) ? "OK" : "ERROR" ;
   // header("location: ../index.html");
}