<?php
require('mysql.php');


$db = new MySQL();
$db->Connect();


if ($_GET['action'] == 'newPost') {
  // get user from frontend
  $productDetails = json_decode(file_get_contents("php://input"));
  $username = $_POST['productName'];
  echo $username;
  
  var_dump($productDetails);
}

if ($_POST['create_post'] == 'Create Post') {
      $postId = time();
      $productName = $_POST['product_name'];
      $productAmount = $_POST['product_amount'];
      $productPrice = $_POST['product_price'];
      $productCategory = $_POST['product_category'];
      $productExpirationDate = $_POST['product_expiration_date'];
      $productDiet = $_POST['product_diet'];
      $productExpirationDate = $_POST['product_expiration_date'];
      $productDescription = $_POST['product_description'];
      $productImage = $_FILES["post_image"];
      $file = $_FILES["post_image"];
      $targetFolder = "../media/posted/";
      $fileName = basename($file["name"]);
      move_uploaded_file($file["tmp_name"], $targetFolder . $fileName);
     
  

      $results2 = $db->Query("INSERT INTO posts (post_id, product_name, amount, price, expires_in, category_name, diet_name, image_name, product_description)
       VALUES ('$postId','$productName', '$productAmount', '$productPrice', '$productExpirationDate', '$productCategory' , '$productDiet', '$fileName', '$productDescription')");
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