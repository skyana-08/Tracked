<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
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
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

// Get raw input for debugging
$input = json_decode(file_get_contents('php://input'), true);

// Debug logging
error_log("Received data: " . print_r($input, true));

if (!$input) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid input data"]);
    exit;
}

if (empty($input['activity_ID']) || empty($input['students'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing required fields: activity_ID or students"]);
    exit;
}

try {
    $pdo->beginTransaction();

    // Prepare UPDATE statement
    $updateStmt = $pdo->prepare("
        UPDATE activity_grades 
        SET grade = ?, 
            submitted = ?, 
            late = ?, 
            submitted_at = CASE 
                WHEN ? = 1 AND submitted_at IS NULL THEN NOW()
                WHEN ? = 0 THEN NULL
                ELSE submitted_at
            END,
            updated_at = NOW() 
        WHERE activity_ID = ? 
        AND student_ID = ?
    ");
    
    // Prepare INSERT statement for new records
    $insertStmt = $pdo->prepare("
        INSERT INTO activity_grades 
        (activity_ID, student_ID, grade, submitted, late, submitted_at, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, 
            CASE 
                WHEN ? = 1 THEN NOW()
                ELSE NULL
            END, 
            NOW(), NOW())
    ");
    
    $updatedCount = 0;
    $insertedCount = 0;
    $errors = [];
    
    foreach ($input['students'] as $student) {
        if (empty($student['user_ID'])) {
            $errors[] = "Skipping student with missing user_ID: " . print_r($student, true);
            continue;
        }

        // Process grade value
        $grade = (isset($student['grade']) && $student['grade'] !== '' && $student['grade'] !== null) ? $student['grade'] : null;
        if ($grade !== null) {
            $grade = (float)$grade;
            if ($grade == (int)$grade) {
                $grade = (int)$grade;
            }
        }
        
        $submitted = isset($student['submitted']) ? ($student['submitted'] ? 1 : 0) : 0;
        $late = isset($student['late']) ? ($student['late'] ? 1 : 0) : 0;
        
        error_log("Processing student {$student['user_ID']}: grade=$grade, submitted=$submitted, late=$late");
        
        // First try to update existing record
        $result = $updateStmt->execute([
            $grade,
            $submitted,
            $late,
            $submitted,
            $submitted,  
            $input['activity_ID'],
            $student['user_ID']
        ]);
        
        $rowsAffected = $updateStmt->rowCount();
        
        // If no rows were updated, insert a new record
        if ($rowsAffected === 0) {
            try {
                $insertResult = $insertStmt->execute([
                    $input['activity_ID'],
                    $student['user_ID'],
                    $grade,
                    $submitted,
                    $late,
                    $submitted
                ]);
                
                if ($insertResult) {
                    $insertedCount++;
                    error_log("INSERTED new record for student {$student['user_ID']}");
                } else {
                    $errorInfo = $insertStmt->errorInfo();
                    $errors[] = "Failed to insert student {$student['user_ID']}: " . ($errorInfo[2] ?? 'Unknown error');
                }
            } catch (Exception $e) {
                $errors[] = "Error inserting student {$student['user_ID']}: " . $e->getMessage();
            }
        } else {
            $updatedCount++;
            error_log("UPDATED existing record for student {$student['user_ID']}");
        }
    }

    $pdo->commit();
    
    error_log("Successfully updated $updatedCount and inserted $insertedCount students");
    
    $response = [
        "success" => true, 
        "message" => "Grades saved successfully",
        "updated_count" => $updatedCount,
        "inserted_count" => $insertedCount,
        "total_students" => count($input['students'])
    ];
    
    if (!empty($errors)) {
        $response['errors'] = $errors;
        $response['warning'] = "Some students could not be saved";
    }
    
    echo json_encode($response);

} catch (Exception $e) {
    $pdo->rollBack();
    error_log("Error saving grades: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "message" => "Error saving grades: " . $e->getMessage()
    ]);
}
?>