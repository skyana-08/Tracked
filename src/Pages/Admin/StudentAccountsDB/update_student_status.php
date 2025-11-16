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

if (!$data) {
    echo json_encode(["success" => false, "message" => "Invalid JSON data"]);
    exit();
}

$studentId = $conn->real_escape_string($data['studentId'] ?? '');
$newStatus = $conn->real_escape_string($data['newStatus'] ?? '');

if (empty($studentId) || empty($newStatus)) {
    echo json_encode(["success" => false, "message" => "Missing required fields: studentId or newStatus"]);
    exit();
}

// Validate status
if (!in_array($newStatus, ['Active', 'Deactivate'])) {
    echo json_encode(["success" => false, "message" => "Invalid status. Must be 'Active' or 'Deactivate'"]);
    exit();
}

// Check if student exists
$checkSql = "SELECT tracked_ID FROM tracked_users WHERE tracked_ID = '$studentId' AND tracked_Role = 'Student'";
$checkResult = $conn->query($checkSql);

if ($checkResult->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Student not found"]);
    exit();
}

// Update the status
$updateSql = "UPDATE tracked_users SET tracked_Status = '$newStatus' WHERE tracked_ID = '$studentId'";
$updateResult = $conn->query($updateSql);

if ($updateResult) {
    echo json_encode(["success" => true, "message" => "Student status updated successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to update student status: " . $conn->error]);
}

$conn->close();
?>