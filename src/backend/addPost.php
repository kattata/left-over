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

if ($_GET['action'] == 'newTransaction'){
  $transactionId = time();
  $transactionPostId = $_POST['ts-postId'];
  $transactionSellerId = $_POST['ts-sellerId'];
  $transactionSellerUserName = $_POST['ts-sellerUsername'];
  $transactionBuyerId = $_POST['ts-buyerId'];
  $transactionBuyerUserName = $_POST['ts-buyerUsername'];
  $transactionProductName = $_POST['ts-product_name'];
  $transactionAmount = $_POST['ts-amount'];
  $transactionPrice = $_POST['ts-price'];
  $transactionAddress = $_POST['ts-address'];
  $transactionZipCode = $_POST['ts-zip_code'];
  $transactionCity = $_POST['ts-city'];
  $transactionCollectionDay = $_POST['ts-collection_date'];
  $transactionPhone = $_POST['ts-phone_number'];
  $transactionTime = $_POST['ts-time_slot'];


  $transactionQuery = $db->Query("INSERT INTO Transactions 
  (transaction_id, post_id, seller_id, seller_username, buyer_id, buyer_username, product_name, amount, price, address, zip_code, city,	collection_day, phone_number, time_slot)
  VALUES ('$transactionId', '$transactionPostId', '$transactionSellerId', '$transactionSellerUserName', '$transactionBuyerId', '$transactionBuyerUserName', '$transactionProductName', '$transactionAmount'
  ,'$transactionPrice', '$transactionAddress', '$transactionZipCod', '$transactionCity', '$transactionCollectionDay', '$transactionPhone','$transactionTime')");
  echo $db -> error;
  
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




    );
    array_push($TransactionJsonArray, $transactionsArray);
}
$fp3 = fopen('transactions.json', 'w');
fwrite($fp3, json_encode($TransactionJsonArray));
fclose($fp3);
$source3 = "transactions.json";
$destination3 = "./json/transactions.json";
echo rename($source3, $destination3) ? "OK" : "ERROR" ;
}