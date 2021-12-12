<?php
require('mysql.php');


$db = new MySQL();
$db->Connect();



if ($_GET['action'] == 'newPost') {
  // get user from frontend
  $postId = $_POST['postId'];
  $sellerId = $_POST['sellerId'];
  $sellerImageName = $_POST['sellerImage'];
  $productAmount = $_POST['productAmount'];
  $productPrice = $_POST['productPrice'];
  $productCategory = $_POST['productCategory'];
  $productDiet = $_POST['productDiet'];
  $productDescription = $_POST['productDescription'];
  $reservedDay = $_POST['reservedDay'];
  $reservedTimeSlots = $_POST['reservedTimeSlots'];
  $productName = $_POST['productName'];
  $productExpirationDate = $_POST['productExpirationDate'];
  $file = $_FILES['file'];
  $targetFolder = "../media/posted/";
  $fileName = basename($file["name"]);
  move_uploaded_file($file["tmp_name"], $targetFolder . $fileName);
  echo $sellerImageName;
  print_r($file);
  
  $results2 = $db->Query("INSERT INTO posts (post_id, seller_id, product_name, amount, price, expires_in, category_name, diet_name, image_name, product_description, seller_image, seller_username)
  VALUES ('$postId', '$sellerId ', '$productName', '$productAmount', '$productPrice', '$productExpirationDate', '$productCategory' , '$productDiet', '$fileName', '$productDescription')");
  

  $results1 = $db->Query("SELECT * FROM posts");
  $usersJsonArray = array();
  foreach ($results1 as $result) {
    $usersArray = array(
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


    );
    array_push($usersJsonArray, $usersArray);

}

//   var_dump($usersJsonArray);
  $fp = fopen('posts.json', 'w');
  fwrite($fp, json_encode($usersJsonArray,));
  fclose($fp);
  $source = "posts.json";
  $destination = "./json/posts.json";
  echo rename($source, $destination) ? "OK" : "ERROR" ;
   // header("location: ../index.html");
}