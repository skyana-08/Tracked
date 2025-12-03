<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = 'localhost';
$dbname = 'u713320770_tracked';
$username = 'u713320770_trackedDB';
$password = 'Tracked@2025';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

// Get parameters
$subject_code = $_GET['subject_code'] ?? '';
$professor_ID = $_GET['professor_ID'] ?? '';

// Log for debugging
error_log("get_attendance_history called: subject_code=$subject_code, professor_ID=$professor_ID");

if (empty($subject_code)) {
    echo json_encode(["success" => false, "message" => "Subject code is required"]);
    exit;
}

// If professor ID is not provided, get it from classes table
if (empty($professor_ID)) {
    $stmt = $pdo->prepare("SELECT professor_ID FROM classes WHERE subject_code = ?");
    $stmt->execute([$subject_code]);
    $class = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($class && !empty($class['professor_ID'])) {
        $professor_ID = $class['professor_ID'];
        error_log("Auto-detected professor_ID: $professor_ID");
    } else {
        echo json_encode([
            "success" => true,
            "message" => "No professor ID found for this subject",
            "attendance_history" => []
        ]);
        exit;
    }
}

try {
    // Get all enrolled students
    $enrolledStmt = $pdo->prepare("
        SELECT 
            t.tracked_ID as user_ID,
            CONCAT(t.tracked_firstname, ' ', t.tracked_lastname) as user_Name,
            t.tracked_yearandsec
        FROM tracked_users t
        INNER JOIN student_classes sc ON t.tracked_ID = sc.student_ID
        WHERE sc.subject_code = ? AND sc.archived = 0
        AND t.tracked_Role = 'Student' AND t.tracked_Status = 'Active'
        ORDER BY t.tracked_firstname, t.tracked_lastname
    ");
    $enrolledStmt->execute([$subject_code]);
    $allEnrolledStudents = $enrolledStmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($allEnrolledStudents)) {
        echo json_encode([
            "success" => true,
            "message" => "No students enrolled in this class",
            "attendance_history" => []
        ]);
        exit;
    }

    // Get distinct attendance dates
    $datesStmt = $pdo->prepare("
        SELECT DISTINCT attendance_date 
        FROM attendance 
        WHERE subject_code = ? AND professor_ID = ?
        ORDER BY attendance_date DESC
    ");
    $datesStmt->execute([$subject_code, $professor_ID]);
    $dates = $datesStmt->fetchAll(PDO::FETCH_ASSOC);

    $attendance_history = [];

    if (empty($dates)) {
        echo json_encode([
            "success" => true,
            "message" => "No attendance records found",
            "attendance_history" => []
        ]);
        exit;
    }

    foreach ($dates as $date_record) {
        $attendance_date = $date_record['attendance_date'];
        
        // Get attendance for this date
        $attendanceStmt = $pdo->prepare("
            SELECT 
                a.student_ID, 
                a.status,
                CONCAT(t.tracked_firstname, ' ', t.tracked_lastname) as user_Name,
                t.tracked_yearandsec
            FROM attendance a
            JOIN tracked_users t ON a.student_ID = t.tracked_ID
            WHERE a.subject_code = ? 
            AND a.professor_ID = ? 
            AND a.attendance_date = ?
        ");
        $attendanceStmt->execute([$subject_code, $professor_ID, $attendance_date]);
        $attendance_records = $attendanceStmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Create map of attendance records
        $attendanceMap = [];
        foreach ($attendance_records as $record) {
            $attendanceMap[$record['student_ID']] = $record;
        }
        
        // Build complete student list
        $completeStudentList = [];
        foreach ($allEnrolledStudents as $enrolledStudent) {
            $studentId = $enrolledStudent['user_ID'];
            
            if (isset($attendanceMap[$studentId])) {
                $completeStudentList[] = $attendanceMap[$studentId];
            } else {
                $completeStudentList[] = [
                    'student_ID' => $studentId,
                    'user_Name' => $enrolledStudent['user_Name'],
                    'tracked_yearandsec' => $enrolledStudent['tracked_yearandsec'],
                    'status' => 'absent'
                ];
            }
        }
        
        // Sort by name
        usort($completeStudentList, function($a, $b) {
            return strcmp($a['user_Name'], $b['user_Name']);
        });

        // Format date
        $formatted_date = date('F j, Y', strtotime($attendance_date));

        $attendance_history[] = [
            "date" => $formatted_date,
            "raw_date" => $attendance_date,
            "students" => $completeStudentList
        ];
    }

    echo json_encode([
        "success" => true,
        "attendance_history" => $attendance_history,
        "summary" => [
            "total_dates" => count($dates),
            "total_students" => count($allEnrolledStudents),
            "subject_code" => $subject_code,
            "professor_ID" => $professor_ID
        ]
    ]);

} catch (Exception $e) {
    error_log("Error: " . $e->getMessage());
    echo json_encode([
        "success" => false, 
        "message" => "Database error occurred"
    ]);
}
?>