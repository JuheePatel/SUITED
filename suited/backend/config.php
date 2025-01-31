<?php
require_once __DIR__ . '/vendor/autoload.php';

// Enable CORS for your frontend domain (http://localhost:5173)
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // Allow any origin (for development)
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allow specific request methods
header("Access-Control-Allow-Headers: Content-Type"); // Allow Content-Type header

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();
?>