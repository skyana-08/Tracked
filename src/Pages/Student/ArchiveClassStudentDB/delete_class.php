<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$host = 'localhost';
$dbname = 'tracked';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $e->getMessage()]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(["success" => false, "message" => "Invalid input data"]);
    exit;
}

if (empty($input['student_id']) || empty($input['subject_code'])) {
    echo json_encode(["success" => false, "message" => "Student ID and Subject Code are required"]);
    exit;
}

try {
    $student_id = $input['student_id'];
    $subject_code = $input['subject_code'];

    // Permanently delete the student's enrollment
    $stmt = $pdo->prepare("DELETE FROM student_classes WHERE student_ID = ? AND subject_code = ?");
    $stmt->execute([$student_id, $subject_code]);

    if ($stmt->rowCount() > 0) {
        echo json_encode([
            "success" => true,
            "message" => "Class permanently deleted"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Class not found or already deleted"
        ]);
    }

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Error deleting class: " . $e->getMessage()]);
}
?>