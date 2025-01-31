<?php
require_once __DIR__ . "/../config.php"; // Load configuration

// Authentication credentials for O*NET API
$username = $_ENV["username"];
$password = $_ENV["password"];
$authHeader = "Basic " . base64_encode("$username:$password");

// O*NET API Base URL
$BASE_URL = "https://services.onetcenter.org/ws/veterans/";

// Helper function for O*NET API requests
function fetchFromONET($endpoint)
{
    global $BASE_URL, $authHeader;
    $url = $BASE_URL . $endpoint;
    $options = [
        "http" => [
            "header" => "Authorization: $authHeader\r\nAccept: application/json\r\n",
            "method" => "GET"
        ]
    ];

    $context = stream_context_create($options);
    $response = file_get_contents($url, false, $context);

    if ($response === FALSE) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to fetch data from O*NET."]);
        exit;
    }
    return $response;
}

// 1. Military Search API - Searches military occupations by keyword
if ($_GET["param"] === "military") {
    if (empty($_GET["keyword"])) {
        http_response_code(400);
        echo json_encode(["error" => "Keyword is required"]);
        exit;
    }
    $keyword = urlencode($_GET["keyword"]);
    try {
        $data = fetchFromONET("military?keyword=$keyword");
        echo $data;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to fetch military data"]);
    }
    exit;
}

// 2. Industry List API - Retrieves a list of industries
if ($_GET["param"] === "industriesList") {
    try {
        $data = fetchFromONET("browse/");
        echo $data;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to fetch industries"]);
    }
    exit;
}

// 3. Industry Careers API - Fetches careers within a specific industry
if ($_GET["param"] === "industries") {
    $code = $_GET["code"] ?? "all";
    $category = $_GET["category"] ?? "all";
    $sort = $_GET["sort"] ?? "category";
    $start = $_GET["start"] ?? 1;
    $end = $_GET["end"] ?? 20;
    try {
        $data = fetchFromONET("browse/$code?category=$category&sort=$sort&start=$start&end=$end");
        echo $data;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to fetch careers"]);
    }
    exit;
}

// 4. Keyword Search API - Searches careers based on a keyword
if ($_GET["param"] === "Keyword") {
    if (empty($_GET["keyword"])) {
        http_response_code(400);
        echo json_encode(["error" => "Keyword is required"]);
        exit;
    }
    $keyword = urlencode($_GET["keyword"]);
    try {
        $data = fetchFromONET("search?keyword=$keyword");
        echo $data;
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to fetch careers"]);
    }
    exit;
}

// Default 404 handler for unknown API endpoints
http_response_code(404);
echo json_encode(["error" => "API endpoint not found"]);
?>
