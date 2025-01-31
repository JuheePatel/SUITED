<?php
require_once __DIR__ . "/../config.php"; // Load configuration file

// Handle preflight requests for CORS
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// Parse incoming JSON request body
$data = json_decode(file_get_contents("php://input"), true);
error_log("Raw POST data: " . file_get_contents("php://input"));

// Validate input data
if (!$data || !isset($data["SKAValueList"]) || !is_array($data["SKAValueList"])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid input, missing or invalid 'SKAValueList'."]);
    exit;
}

// CareerOneStop API credentials
$apiToken = $_ENV["apiToken"];
$userId = $_ENV["userId"];
$url = "https://api.careeronestop.org/v1/skillsmatcher/$userId";

// Prepare API request payload
$requestData = json_encode(["SKAValueList" => $data["SKAValueList"]]);
error_log("API request payload: " . $requestData);

// Initialize cURL request
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Bearer $apiToken"
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $requestData);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);

// Execute API request
$response = curl_exec($ch);

// Handle cURL errors
if ($response === false) {
    error_log("cURL Error: " . curl_error($ch));
    http_response_code(500);
    echo json_encode(["error" => "Failed to communicate with CareerOneStop API."]);
    curl_close($ch);
    exit;
}

// Handle API response errors
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
if ($httpCode != 200) {
    error_log("HTTP Error: $httpCode - $response");
    http_response_code($httpCode);
    echo json_encode(["error" => "Failed to communicate with CareerOneStop API.", "details" => $response]);
    curl_close($ch);
    exit;
}

curl_close($ch);
echo $response; // Return API response
?>
