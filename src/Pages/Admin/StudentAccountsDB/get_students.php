<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "u713320770_trackedDB", "Tracked@2025", "u713320770_tracked");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}

$studentId = $_GET['id'] ?? '';

if (!empty($studentId)) {
    // Return single student
    $sql = "SELECT * FROM tracked_users WHERE tracked_ID = ? AND tracked_Role = 'Student'";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $studentId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $student = $result->fetch_assoc();
        echo json_encode(["success" => true, "student" => $student]);
    } else {
        echo json_encode(["success" => false, "message" => "Student not found"]);
    }
    $stmt->close();
} else {
    // Return all students
    $sql = "SELECT * FROM tracked_users WHERE tracked_Role = 'Student'";
    $result = $conn->query($sql);
    
    $students = [];
    while ($row = $result->fetch_assoc()) {
        $students[] = $row;
    }
    
    echo json_encode($students); // Return array directly
}

$conn->close();
?>