<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/../EmailNotificationDB/send_student_email.php';

// Database configuration
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

$input = json_decode(file_get_contents('php://input'), true);
$subject_code = $input['subject_code'] ?? '';

if (empty($subject_code)) {
    echo json_encode(["success" => false, "message" => "Subject code is required"]);
    exit;
}

try {
    // Check for students with 3+ absences or equivalent
    $stmt = $pdo->prepare("
        SELECT 
            tu.tracked_ID,
            tu.tracked_email,
            tu.tracked_firstname,
            tu.tracked_lastname,
            c.subject,
            c.section,
            SUM(CASE 
                WHEN a.status = 'absent' THEN 1 
                WHEN a.status = 'late' THEN 0.33 
                ELSE 0 
            END) as absence_count,
            COUNT(CASE WHEN a.status = 'absent' THEN 1 END) as total_absences,
            COUNT(CASE WHEN a.status = 'late' THEN 1 END) as total_lates
        FROM tracked_users tu
        JOIN student_classes sc ON tu.tracked_ID = sc.student_ID
        JOIN classes c ON sc.subject_code = c.subject_code
        LEFT JOIN attendance a ON tu.tracked_ID = a.student_ID AND a.subject_code = ?
        WHERE sc.subject_code = ? AND sc.archived = 0 AND tu.tracked_Status = 'Active'
        GROUP BY tu.tracked_ID
        HAVING absence_count >= 3
    ");
    $stmt->execute([$subject_code, $subject_code]);
    $atRiskStudents = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $emailResults = [];
    foreach ($atRiskStudents as $student) {
        $emailSubject = "⚠️ Attendance Risk Warning - " . $student['subject'];
        $emailTitle = "Attendance Risk Alert";
        $emailMessage = "You have " . number_format($student['absence_count'], 1) . " equivalent absences in " . 
                       $student['subject'] . " (" . $student['section'] . ").\n\n" .
                       "Breakdown:\n" .
                       "- Total Absences: " . $student['total_absences'] . "\n" .
                       "- Total Late Arrivals: " . $student['total_lates'] . "\n\n" .
                       "⚠️ You are at risk of being dropped from the class. Please improve your attendance immediately.";
        
        $emailSent = sendStudentEmailNotification(
            $student['tracked_email'],
            $student['tracked_firstname'] . ' ' . $student['tracked_lastname'],
            $emailSubject,
            $emailTitle,
            $emailMessage,
            'attendance'
        );
        
        $emailResults[] = [
            'student_id' => $student['tracked_ID'],
            'student_name' => $student['tracked_firstname'] . ' ' . $student['tracked_lastname'],
            'absence_count' => $student['absence_count'],
            'total_absences' => $student['total_absences'],
            'total_lates' => $student['total_lates'],
            'email_sent' => $emailSent
        ];
    }
    
    echo json_encode([
        "success" => true,
        "message" => "Attendance warnings processed",
        "students_at_risk" => count($atRiskStudents),
        "email_results" => $emailResults
    ]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Error processing attendance warnings: " . $e->getMessage()]);
}
?>