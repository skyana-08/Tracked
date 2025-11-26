<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$host = 'localhost';
$dbname = 'u713320770_tracked';
$username = 'u713320770_trackedDB';
$password = 'Tracked@2025';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $e->getMessage()]);
    exit;
}

$professor_ID = $_GET['professor_ID'] ?? '';

if (empty($professor_ID)) {
    echo json_encode(["success" => false, "message" => "Professor ID is required"]);
    exit;
}

try {
    // Get professor details from tracked_users table
    $stmt = $pdo->prepare("
        SELECT 
            tracked_ID,
            tracked_firstname,
            tracked_middlename,
            tracked_lastname,
            tracked_email,
            tracked_gender,
            tracked_program,
            tracked_Status
        FROM tracked_users 
        WHERE tracked_ID = ? AND tracked_Role = 'Professor'
    ");
    $stmt->execute([$professor_ID]);
    $professor = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($professor) {
        echo json_encode([
            "success" => true,
            "professor" => $professor
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Professor not found"
        ]);
    }

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Error fetching professor details: " . $e->getMessage()]);
}
?>