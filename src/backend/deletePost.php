<?php

require('mysql.php');

$db = new MySQL();
$db->Connect();

if ($_GET['action'] == 'deletePost') {
    $postId = json_decode(file_get_contents("php://input"));
    echo $postId;

    global $db;
    // delete post from db
    $results = $db->Query("DELETE FROM posts WHERE post_id = '$postId'");
    // fetch updated posts from db
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
}