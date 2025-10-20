<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection configuration
$host = 'localhost';
$dbname = 'tracked';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $e->getMessage()]);
    exit();
}

$response = ['success' => false, 'message' => '', 'classes' => []];

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        throw new Exception('Only GET requests are allowed');
    }

    // Get professor_ID from query parameters
    $professor_ID = isset($_GET['professor_ID']) ? trim($_GET['professor_ID']) : '';

    if (empty($professor_ID)) {
        throw new Exception('Professor ID is required');
    }

    // Fetch classes for this professor
    $sql = "SELECT * FROM classes WHERE professor_ID = ? AND status = 'Active' ORDER BY created_at DESC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$professor_ID]);
    $classes = $stmt->fetchAll();

    $response['success'] = true;
    $response['message'] = 'Classes fetched successfully';
    $response['classes'] = $classes;

} catch (PDOException $e) {
    $response['message'] = 'Database error: ' . $e->getMessage();
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
?>