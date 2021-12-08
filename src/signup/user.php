<?php

// $foodObject = $result->fetch_object("Food");

class User {
    public $username;
    // public $email;
    // public $phone;
    // public $address;
    // public $zipCode;
    // public $city;

    function __construct($username) {
    // function __construct($username, $email, $phone, $address, $zipCode, $city) {
        $this->username = $username;
    }
}