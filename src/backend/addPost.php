<?php
require('mysql.php');


$db = new MySQL();
$db->Connect();



if ($_GET['action'] == 'newPost') {
  // get user from frontend
  $postId = $_POST['postId'];
  $sellerId = $_POST['sellerId'];
  $productName = $_POST['productName'];
  $productAmount = $_POST['productAmount'];
  $productPrice = $_POST['productPrice'];
  $productExpirationDate = $_POST['productExpirationDate'];
  $productCategory = $_POST['productCategory'];
  $productDiet = $_POST['productDiet'];
  $productDescription = $_POST['productDescription'];
  $reservedDay = $_POST['reservedDay'];
  $reservedTimeSlots = $_POST['reservedTimeSlots'];
  $sellerImageName = $_POST['sellerImage'];
  $sellerUserName = $_POST['sellerUserName'];
  $file = $_FILES['file'];
  $uploadedImageName = $file["name"];
  $targetFolder = "../media/posted/";
  $fileName = basename($file["name"]);
  move_uploaded_file($file["tmp_name"], $targetFolder . $fileName);
 
  $results2 = $db->Query("INSERT INTO posts(post_id, seller_id, product_name, amount, price, expires_in, category_name, diet_name, image_name, product_description, seller_image, seller_username)
  VALUES('$postId', '$sellerId', '$productName', '$productAmount', '$productPrice', '$productExpirationDate', '$productCategory', '$productDiet', '$uploadedImageName', '$productDescription', '$sellerImageName', '$sellerUserName')");

  
  $results1 = $db->Query("SELECT * FROM posts");
  var_dump($results2);

  $postsJsonArray = array();
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