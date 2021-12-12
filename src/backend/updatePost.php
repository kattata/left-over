<?php
if ($_GET['action'] == 'updatePost') {
    $postId = $_POST['postId'];
    $productName = $_POST['productName'];
    $amount = $_POST['amount'];
    $price = $_POST['price'];
    $expirationDate = $_POST['expirationDate'];
    $description = $_POST['description'];

    $targetFolder = "../media/posted/";
    $imgName = $_FILES['file']['name'];
    $fileName = basename($imgName);
    $allowedMaxFileSize = 1024 * 1024 * 5;
    $imgSize = $_POST['fileSize'];

    global $db;
        $results = $db->Query("UPDATE posts SET product_name = '$productName', amount = '$amount', price = '$price', expires_in = '$expirationDate', product_description = '$description', image_name = '$imgName' WHERE post_id = '$postId'");
        // fetch users data from db
        $dbResults = $db->Query("SELECT * FROM posts");
        // save users data in json
        $postsJson = array();
        foreach ($dbResults as $result) {
            $posts = array(
                "post_id" => $result["post_id"],
                "seller_id" => $result["seller_id"],
                "seller_username" => $result["seller_username"],
                "seller_image" => $result["seller_image"],
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
            array_push($postsJson, $posts);
        }
        $fp = fopen('posts.json', 'w');
        fwrite($fp, json_encode($postsJson,));
        fclose($fp);
        $source = "posts.json";
        $destination = "./json/posts.json";
        rename($source, $destination) ? "OK" : "ERROR" ;
        // upload image
        move_uploaded_file($_FILES['file']["tmp_name"], $targetFolder . $fileName);
        // errors
        global $error;
        $error = "";
        echo json_encode(array($error, $id));
}