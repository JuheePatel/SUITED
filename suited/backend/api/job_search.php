<?php
require_once "Careerjet_API.php"; // Include the Careerjet API class
require_once __DIR__ . "/../config.php"; // Load configuration file

// Handle preflight requests for CORS
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// Handle POST requests
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    // Validate input parameters
    if (empty($data["location"]) || empty($data["jobTitle"])) {
        echo json_encode([
            "error" => true,
            "message" => "Missing required parameters: location, jobTitle."
        ]);
        exit;
    }

    // Initialize Careerjet API
    $cjapi = new Careerjet_API("en_US");
    $search_params = [
        "keywords" => $data["jobTitle"],
        "location" => $data["location"] ?? "",
        "affid"    => $_ENV["affid"], // API affiliate ID
        "sort"     => $data["sort"] ?? "relevance",
        "pagesize" => $data["pagesize"] ?? 10,
        "page"     => $data["page"] ?? 1,
    ];

    // Call the Careerjet API
    $result = $cjapi->search($search_params);

    // Handle API errors
    if ($result->type === "ERROR") {
        echo json_encode([
            "error" => true,
            "message" => $result->error
        ]);
        exit;
    }

    // Return API response
    $response = [
        "success" => true,
        "hits" => $result->hits,
        "jobs" => $result->jobs,
        "pages" => $result->pages,
    ];
    echo json_encode($response);
    exit;
}

// Handle invalid request methods
echo json_encode(["error" => "Invalid request method"]);
?>
