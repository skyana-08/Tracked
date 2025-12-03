<?php
ob_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Max-Age: 86400');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Log all POST data for debugging
error_log('Upload attempt: ' . print_r($_POST, true));
error_log('Files received: ' . print_r($_FILES, true));

$host = 'localhost';
$dbname = 'u713320770_tracked';
$username = 'u713320770_trackedDB';
$password = 'Tracked@2025';

// Get POST data
$activity_id = $_POST['activity_id'] ?? '';
$student_id = $_POST['student_id'] ?? '';

// Debug output
error_log("Activity ID: $activity_id, Student ID: $student_id");

if (empty($activity_id) || empty($student_id)) {
    echo json_encode([
        'success' => false, 
        'message' => 'Missing required data',
        'debug' => [
            'activity_id' => $activity_id,
            'student_id' => $student_id,
            'post_data' => $_POST
        ]
    ]);
    exit();
}

// First, check if student exists in database
try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Check student exists
    $checkStudent = $conn->prepare("SELECT tracked_ID FROM tracked_users WHERE tracked_ID = ?");
    $checkStudent->execute([$student_id]);
    $student = $checkStudent->fetch(PDO::FETCH_ASSOC);
    
    if (!$student) {
        // Check all student IDs to see what's available
        $allStudents = $conn->query("SELECT tracked_ID FROM tracked_users WHERE tracked_Role = 'Student' LIMIT 10");
        $availableStudents = $allStudents->fetchAll(PDO::FETCH_COLUMN);
        
        throw new Exception("Student '$student_id' not found. Available students: " . implode(', ', $availableStudents));
    }
    
    // Check activity exists
    $checkActivity = $conn->prepare("SELECT id FROM activities WHERE id = ?");
    $checkActivity->execute([$activity_id]);
    $activity = $checkActivity->fetch(PDO::FETCH_ASSOC);
    
    if (!$activity) {
        throw new Exception("Activity '$activity_id' not found");
    }
    
    // Rest of your upload code...
    $uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/TrackEd_Uploads/To_Students/';
    
    if (!file_exists($uploadDir)) {
        if (!mkdir($uploadDir, 0777, true)) {
            throw new Exception('Failed to create upload directory');
        }
    }
    
    if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('No file uploaded or upload error');
    }
    
    $file = $_FILES['file'];
    $originalName = basename($file['name']);
    $fileSize = $file['size'];
    $fileTmpName = $file['tmp_name'];
    $fileType = $file['type'];
    
    $maxFileSize = 25 * 1024 * 1024;
    if ($fileSize > $maxFileSize) {
        throw new Exception('File size must be less than 25MB');
    }
    
    $fileExtension = pathinfo($originalName, PATHINFO_EXTENSION);
    $safeFileName = preg_replace('/[^a-zA-Z0-9._-]/', '_', $originalName);
    $uniqueFileName = time() . '_' . uniqid() . '_' . $safeFileName;
    $uploadPath = $uploadDir . $uniqueFileName;
    
    if (!move_uploaded_file($fileTmpName, $uploadPath)) {
        throw new Exception('Failed to move uploaded file');
    }
    
    $fileUrl = "https://tracked.6minds.site/TrackEd_Uploads/To_Students/" . $uniqueFileName;
    
    // Begin transaction
    $conn->beginTransaction();
    
    // Insert into activity_files
    $stmt = $conn->prepare("
        INSERT INTO activity_files 
        (activity_id, student_id, file_name, original_name, file_url, file_size, file_type, uploaded_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $result = $stmt->execute([
        $activity_id,
        $student_id,
        $uniqueFileName,
        $originalName,
        $fileUrl,
        $fileSize,
        $fileType,
        'student'
    ]);
    
    if (!$result) {
        $errorInfo = $stmt->errorInfo();
        throw new Exception("Failed to insert file record: " . ($errorInfo[2] ?? 'Unknown error'));
    }
    
    $fileId = $conn->lastInsertId();
    
    // Update activity_grades
    $checkGrade = $conn->prepare("SELECT id FROM activity_grades WHERE activity_ID = ? AND student_ID = ?");
    $checkGrade->execute([$activity_id, $student_id]);
    $gradeExists = $checkGrade->fetch(PDO::FETCH_ASSOC);
    
    if ($gradeExists) {
        $updateStmt = $conn->prepare("
            UPDATE activity_grades 
            SET submitted = 1,
                submitted_at = NOW(),
                uploaded_file_url = ?,
                uploaded_file_name = ?,
                updated_at = NOW()
            WHERE activity_ID = ? AND student_ID = ?
        ");
        $updateStmt->execute([$fileUrl, $originalName, $activity_id, $student_id]);
    } else {
        $insertStmt = $conn->prepare("
            INSERT INTO activity_grades 
            (activity_ID, student_ID, submitted, submitted_at, uploaded_file_url, uploaded_file_name, created_at, updated_at)
            VALUES (?, ?, 1, NOW(), ?, ?, NOW(), NOW())
        ");
        $insertStmt->execute([$activity_id, $student_id, $fileUrl, $originalName]);
    }
    
    $conn->commit();
    
    echo json_encode([
        'success' => true,
        'message' => 'File uploaded successfully',
        'debug' => [
            'student_id_used' => $student_id,
            'activity_id_used' => $activity_id
        ],
        'file' => [
            'id' => $fileId,
            'original_name' => $originalName,
            'file_url' => $fileUrl
        ]
    ]);
    
} catch (Exception $e) {
    if (isset($conn) && $conn->inTransaction()) {
        $conn->rollBack();
    }
    
    if (isset($uploadPath) && file_exists($uploadPath)) {
        unlink($uploadPath);
    }
    
    error_log('File upload error: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Upload failed: ' . $e->getMessage(),
        'error_details' => $e->getMessage()
    ]);
}

ob_end_flush();
?>