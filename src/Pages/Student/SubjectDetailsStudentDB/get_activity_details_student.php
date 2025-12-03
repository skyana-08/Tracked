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

$activity_id = $_GET['activity_id'] ?? '';
$student_id = $_GET['student_id'] ?? '';

if (empty($activity_id) || empty($student_id)) {
    echo json_encode(["success" => false, "message" => "Activity ID and Student ID are required"]);
    exit;
}

try {
    // Get activity details with grade and professor files
    $stmt = $pdo->prepare("
        SELECT 
            a.*,
            DATE_FORMAT(a.deadline, '%Y-%m-%dT%H:%i:%sZ') as deadline,
            DATE_FORMAT(a.created_at, '%Y-%m-%dT%H:%i:%sZ') as created_at,
            ag.grade,
            ag.submitted,
            ag.late,
            DATE_FORMAT(ag.submitted_at, '%Y-%m-%dT%H:%i:%sZ') as submitted_at,
            ag.uploaded_file_url as professor_file_url,
            ag.uploaded_file_name as professor_file_name
        FROM activities a
        LEFT JOIN activity_grades ag ON a.id = ag.activity_ID AND ag.student_ID = ?
        WHERE a.id = ?
    ");
    $stmt->execute([$student_id, $activity_id]);
    $activity = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$activity) {
        echo json_encode(["success" => false, "message" => "Activity not found"]);
        exit;
    }

    // Get professor's uploaded files for this student and activity
    $professorFilesStmt = $pdo->prepare("
        SELECT * FROM activity_files 
        WHERE activity_id = ? AND student_id = ? AND uploaded_by = 'professor'
        ORDER BY uploaded_at DESC
    ");
    $professorFilesStmt->execute([$activity_id, $student_id]);
    $professor_files = $professorFilesStmt->fetchAll(PDO::FETCH_ASSOC);

    // Get student's uploaded files
    $studentFilesStmt = $pdo->prepare("
        SELECT * FROM activity_files 
        WHERE activity_id = ? AND student_id = ? AND uploaded_by = 'student'
        ORDER BY uploaded_at DESC
    ");
    $studentFilesStmt->execute([$activity_id, $student_id]);
    $student_files = $studentFilesStmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "activity" => $activity,
        "professor_files" => $professor_files,
        "student_files" => $student_files
    ]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Error fetching activity details: " . $e->getMessage()]);
}
?>