<?php
header("Content-Type:application/json");
header("Access-Control-Allow-Origin: *");

$users = [
  [
    "name"       => "Mithu",
    "age"        => 29,
    "occupation" => "Web Developer",
  ],
];

echo json_encode($users, JSON_PRETTY_PRINT);