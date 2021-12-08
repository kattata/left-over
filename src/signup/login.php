<?php

session_start();
$_SESSION['email'] = "peepeepoopoo";

header("Location: ../../index.php#/");