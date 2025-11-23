<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
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

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(["success" => false, "message" => "Invalid input data"]);
    exit;
}

$subject_code = $input['subject_code'] ?? '';
$professor_ID = $input['professor_ID'] ?? '';
$attendance_date = $input['attendance_date'] ?? '';
$attendance_records = $input['attendance_records'] ?? [];

if (empty($subject_code) || empty($professor_ID) || empty($attendance_date) || empty($attendance_records)) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

try {
    $pdo->beginTransaction();
    
    foreach ($attendance_records as $record) {
        $student_ID = $record['student_ID'] ?? '';
        $status = $record['status'] ?? '';
        
        if (empty($student_ID) || empty($status)) {
            continue;
        }
        
        // Check if record exists
        $checkStmt = $pdo->prepare("
            SELECT COUNT(*) FROM attendance 
            WHERE subject_code = ? AND professor_ID = ? AND student_ID = ? AND attendance_date = ?
        ");
        $checkStmt->execute([$subject_code, $professor_ID, $student_ID, $attendance_date]);
        $exists = $checkStmt->fetchColumn();
        
        if ($exists) {
            // Update existing record
            $updateStmt = $pdo->prepare("
                UPDATE attendance 
                SET status = ?, updated_at = NOW()
                WHERE subject_code = ? AND professor_ID = ? AND student_ID = ? AND attendance_date = ?
            ");
            $updateStmt->execute([$status, $subject_code, $professor_ID, $student_ID, $attendance_date]);
        } else {
            // Insert new record
            $insertStmt = $pdo->prepare("
                INSERT INTO attendance (subject_code, professor_ID, student_ID, attendance_date, status, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, NOW(), NOW())
            ");
            $insertStmt->execute([$subject_code, $professor_ID, $student_ID, $attendance_date, $status]);
        }
    }
    
    $pdo->commit();
    echo json_encode(["success" => true, "message" => "Attendance updated successfully"]);
    
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(["success" => false, "message" => "Error updating attendance: " . $e->getMessage()]);
}
?>