<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = 'localhost';
$dbname = 'u713320770_tracked';
$username = 'u713320770_trackedDB';
$password = 'Tracked@2025';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Get parameters
    $activity_id = $_GET['activity_id'] ?? '';
    
    if (empty($activity_id)) {
        echo json_encode(['success' => false, 'message' => 'Activity ID is required']);
        exit;
    }
    
    // Build query
    $sql = "SELECT * FROM activity_files WHERE activity_id = :activity_id";
    $params = [':activity_id' => $activity_id];
    
    if (isset($_GET['student_id']) && !empty($_GET['student_id'])) {
        $sql .= " AND student_id = :student_id";
        $params[':student_id'] = $_GET['student_id'];
    }
    
    $sql .= " ORDER BY uploaded_at DESC";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    $files = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'count' => count($files),
        'files' => $files
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>