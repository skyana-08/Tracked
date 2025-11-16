<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$conn = new mysqli("localhost", "u713320770_trackedDB", "Tracked@2025", "u713320770_tracked");

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Database connection failed"]));
}

// Get the raw POST data
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Invalid input data"]);
    exit;
}

$tracked_ID = $conn->real_escape_string($data['tracked_ID'] ?? '');
$tracked_firstname = $conn->real_escape_string($data['tracked_firstname'] ?? '');
$tracked_middlename = $conn->real_escape_string($data['tracked_middlename'] ?? '');
$tracked_lastname = $conn->real_escape_string($data['tracked_lastname'] ?? '');
$tracked_phone = $conn->real_escape_string($data['tracked_phone'] ?? '');

// Validate required fields
if (empty($tracked_ID)) {
    echo json_encode(["success" => false, "message" => "Student ID is required"]);
    exit;
}

// Update query - only update the allowed fields
$sql = "UPDATE tracked_users SET 
        tracked_firstname = ?,
        tracked_middlename = ?,
        tracked_lastname = ?,
        tracked_phone = ?,
        updated_at = CURRENT_TIMESTAMP
        WHERE tracked_ID = ? AND tracked_Role = 'Student'";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sssss", $tracked_firstname, $tracked_middlename, $tracked_lastname, $tracked_phone, $tracked_ID);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Student information updated successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "No changes made or student not found"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Error updating student: " . $conn->error]);
}

$stmt->close();
$conn->close();
?>