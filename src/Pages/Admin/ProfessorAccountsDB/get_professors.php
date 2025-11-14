<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "u713320770_trackedDB", "Tracked@2025", "u713320770_tracked");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}

$professorId = $_GET['id'] ?? '';

if (!empty($professorId)) {
    // Return single professor
    $sql = "SELECT * FROM tracked_users WHERE tracked_ID = ? AND tracked_Role = 'Professor'";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $professorId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $professor = $result->fetch_assoc();
        echo json_encode(["success" => true, "professor" => $professor]);
    } else {
        echo json_encode(["success" => false, "message" => "Professor not found"]);
    }
    $stmt->close();
} else {
    // Return all professors
    $sql = "SELECT * FROM tracked_users WHERE tracked_Role = 'Professor'";
    $result = $conn->query($sql);
    
    $professors = [];
    while ($row = $result->fetch_assoc()) {
        $professors[] = $row;
    }
    
    echo json_encode($professors); // Return array directly
}

$conn->close();
?>