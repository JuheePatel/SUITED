<?php
require_once __DIR__ . "/../config.php"; // Load configuration file

// CareerOneStop API credentials
$apiToken = $_ENV["apiToken"];
$userId = $_ENV["userId"];

// Define the CareerOneStop API endpoint
$url = "https://api.careeronestop.org/v1/skillsmatcher/$userId";
$options = [
    "http" => [
        "header" => "Content-Type: application/json\r\n" .
                    "Authorization: Bearer $apiToken\r\n",
        "method" => "GET",
    ],
];

$context = stream_context_create($options);
$response = @file_get_contents($url, false, $context);

// Handle request failure
if ($response === FALSE) {
    $error = error_get_last();
    http_response_code(500);
    echo json_encode([
        "error" => "Failed to fetch skills from CareerOneStop API",
        "details" => $error["message"] ?? "Unknown error",
    ]);
    exit;
}

$data = json_decode($response, true);

// Handle invalid JSON response
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(500);
    echo json_encode([
        "error" => "Invalid JSON response from CareerOneStop API",
        "details" => json_last_error_msg(),
    ]);
    exit;
}

// Return API response as JSON
echo json_encode($data);
?>
