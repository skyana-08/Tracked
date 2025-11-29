<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "u713320770_trackedDB", "Tracked@2025", "u713320770_tracked");

if ($conn->connect_error) {
    echo json_encode([
        "success" => false, 
        "message" => "Database connection failed",
        "Admins" => 0,
        "Professors" => 0,
        "Students" => 0
    ]);
    exit();
}

// Get counts for all user types
$sql = "SELECT 
    SUM(CASE WHEN tracked_Role = 'Admin' THEN 1 ELSE 0 END) as Admins,
    SUM(CASE WHEN tracked_Role = 'Professor' THEN 1 ELSE 0 END) as Professors,
    SUM(CASE WHEN tracked_Role = 'Student' THEN 1 ELSE 0 END) as Students
FROM tracked_users";

$result = $conn->query($sql);

if ($result) {
    $counts = $result->fetch_assoc();
    
    // Ensure all counts are integers and not null
    $counts['Admins'] = (int)$counts['Admins'];
    $counts['Professors'] = (int)$counts['Professors'];
    $counts['Students'] = (int)$counts['Students'];
    $counts['success'] = true;
    
    echo json_encode($counts);
} else {
    echo json_encode([
        "success" => false, 
        "message" => "Error fetching user counts",
        "Admins" => 0,
        "Professors" => 0,
        "Students" => 0
    ]);
}

$conn->close();
?>