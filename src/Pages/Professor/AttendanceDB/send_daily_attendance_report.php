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
$attendance_date = $input['attendance_date'] ?? date('Y-m-d');

if (empty($subject_code)) {
    echo json_encode(["success" => false, "message" => "Subject code is required"]);
    exit;
}

try {
    // Get today's attendance summary
    $stmt = $pdo->prepare("
        SELECT 
            tu.tracked_ID,
            tu.tracked_email,
            tu.tracked_firstname,
            tu.tracked_lastname,
            c.subject,
            c.section,
            a.status,
            a.attendance_date
        FROM tracked_users tu
        JOIN student_classes sc ON tu.tracked_ID = sc.student_ID
        JOIN classes c ON sc.subject_code = c.subject_code
        LEFT JOIN attendance a ON tu.tracked_ID = a.student_ID AND a.subject_code = ? AND a.attendance_date = ?
        WHERE sc.subject_code = ? AND sc.archived = 0 AND tu.tracked_Status = 'Active'
    ");
    $stmt->execute([$subject_code, $attendance_date, $subject_code]);
    $attendanceRecords = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $emailResults = [];
    foreach ($attendanceRecords as $record) {
        $status = $record['status'] ?? 'not_recorded';
        
        if ($status === 'absent' || $status === 'late') {
            $emailSubject = "Today's Attendance - " . $record['subject'];
            $emailTitle = "Attendance Record for " . date('M j, Y', strtotime($attendance_date));
            
            if ($status === 'absent') {
                $emailMessage = "You were marked as ABSENT in " . $record['subject'] . " (" . $record['section'] . ") today.\n\n" .
                               "Please coordinate with your professor regarding your absence.";
            } else {
                $emailMessage = "You were marked as LATE in " . $record['subject'] . " (" . $record['section'] . ") today.\n\n" .
                               "Remember that 3 late marks count as 1 absence.";
            }
            
            $emailSent = sendStudentEmailNotification(
                $record['tracked_email'],
                $record['tracked_firstname'] . ' ' . $record['tracked_lastname'],
                $emailSubject,
                $emailTitle,
                $emailMessage,
                'attendance'
            );
            
            $emailResults[] = [
                'student_id' => $record['tracked_ID'],
                'student_name' => $record['tracked_firstname'] . ' ' . $record['tracked_lastname'],
                'status' => $status,
                'email_sent' => $emailSent
            ];
        }
    }
    
    echo json_encode([
        "success" => true,
        "message" => "Daily attendance reports sent",
        "attendance_date" => $attendance_date,
        "notifications_sent" => count($emailResults),
        "email_results" => $emailResults
    ]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Error sending daily attendance reports: " . $e->getMessage()]);
}
?>