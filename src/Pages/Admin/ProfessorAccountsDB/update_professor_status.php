<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = new mysqli("localhost", "u713320770_trackedDB", "Tracked@2025", "u713320770_tracked");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

// Get raw POST data
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Log the received data for debugging
error_log("Received data: " . print_r($data, true));

if (!$data) {
    echo json_encode(["success" => false, "message" => "Invalid JSON data"]);
    exit();
}

$professorId = $conn->real_escape_string($data['professorId'] ?? '');
$newStatus = $conn->real_escape_string($data['newStatus'] ?? '');

if (empty($professorId) || empty($newStatus)) {
    echo json_encode(["success" => false, "message" => "Missing required fields: professorId or newStatus"]);
    exit();
}

// Validate status
if (!in_array($newStatus, ['Active', 'Deactivated'])) {
    echo json_encode(["success" => false, "message" => "Invalid status. Must be 'Active' or 'Deactivated'"]);
    exit();
}

// Check if professor exists
$checkSql = "SELECT tracked_ID FROM tracked_users WHERE tracked_ID = '$professorId' AND tracked_Role = 'Professor'";
$checkResult = $conn->query($checkSql);

if ($checkResult->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Professor not found"]);
    exit();
}

// Update the status
$updateSql = "UPDATE tracked_users SET tracked_Status = '$newStatus' WHERE tracked_ID = '$professorId'";
$updateResult = $conn->query($updateSql);

if ($updateResult) {
    echo json_encode(["success" => true, "message" => "Professor status updated successfully from database"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to update professor status: " . $conn->error]);
}

$conn->close();
?>