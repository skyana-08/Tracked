<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
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

$section = $_GET['section'] ?? '';
$subject_code = $_GET['subject_code'] ?? '';

if (empty($section) || empty($subject_code)) {
    echo json_encode(["success" => false, "message" => "Section and Subject Code are required"]);
    exit;
}

try {
    // Get students who are enrolled in this specific class (by subject_code)
    // Don't check section matching in users table, just get all students enrolled in this class
    $sql = "
        SELECT 
            u.user_ID, 
            u.user_Name, 
            u.user_Email,
            u.user_Gender,
            u.YearandSection,
            sc.enrolled_at
        FROM users u
        INNER JOIN student_classes sc ON u.user_ID = sc.student_ID
        WHERE u.user_Role = 'Student' 
        AND sc.subject_code = ?
        AND sc.archived = 0
        ORDER BY u.user_Name
    ";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$subject_code]);
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // For debugging - get class info
    $classStmt = $pdo->prepare("SELECT subject_code, subject, section FROM classes WHERE subject_code = ?");
    $classStmt->execute([$subject_code]);
    $classInfo = $classStmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "students" => $students,
        "class_info" => $classInfo,
        "debug" => [
            "requested_section" => $section,
            "requested_subject_code" => $subject_code,
            "student_count" => count($students),
            "class_found" => $classInfo ? true : false,
            "class_section" => $classInfo['section'] ?? 'N/A'
        ]
    ]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Error fetching students: " . $e->getMessage()]);
}
?>