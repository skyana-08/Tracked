<?php
// Start output buffering to catch any errors
ob_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Suppress any PHP warnings/errors from being output
error_reporting(E_ALL & ~E_WARNING & ~E_NOTICE);
ini_set('display_errors', 0);

$host = 'localhost';
$dbname = 'u713320770_tracked';
$username = 'u713320770_trackedDB';
$password = 'Tracked@2025';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    // Clear any output before sending JSON
    ob_end_clean();
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

$subject_code = $_GET['subject_code'] ?? '';
$professor_ID = $_GET['professor_ID'] ?? '';

if (empty($subject_code)) {
    ob_end_clean();
    echo json_encode(["success" => false, "message" => "Subject code is required"]);
    exit;
}

try {
    // Get class details with professor name
    $stmt = $pdo->prepare("
        SELECT 
            c.subject_code,
            c.subject,
            c.section,
            c.professor_ID,
            c.year_level,
            c.subject_semester,
            c.status,
            CONCAT(p.tracked_firstname, ' ', p.tracked_lastname) as professor_name
        FROM classes c
        LEFT JOIN tracked_users p ON c.professor_ID = p.tracked_ID
        WHERE c.subject_code = ?
    ");
    $stmt->execute([$subject_code]);
    $class_data = $stmt->fetch(PDO::FETCH_ASSOC);

    // Clear buffer before output
    ob_end_clean();
    
    if ($class_data) {
        // Optional: Verify professor owns this class if professor_ID is provided
        if (!empty($professor_ID) && $class_data['professor_ID'] !== $professor_ID) {
            echo json_encode([
                "success" => false,
                "message" => "Unauthorized access to this class"
            ]);
        } else {
            echo json_encode([
                "success" => true,
                "class_data" => $class_data
            ]);
        }
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Class not found"
        ]);
    }

} catch (Exception $e) {
    ob_end_clean();
    echo json_encode(["success" => false, "message" => "Error fetching class details"]);
}
?>