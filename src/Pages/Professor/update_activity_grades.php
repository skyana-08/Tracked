<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$host = '127.0.0.1';
$dbname = 'tracked';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || empty($input['activity_ID']) || empty($input['students'])) {
    echo json_encode(["success" => false, "message" => "Invalid input data"]);
    exit;
}

try {
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("UPDATE activity_grades SET grade = ?, submitted = ?, late = ?, submitted_at = CASE WHEN ? = 1 AND submitted = 0 THEN NOW() ELSE submitted_at END WHERE activity_ID = ? AND student_ID = ?");
    
    foreach ($input['students'] as $student) {
        // Convert empty string to null, and remove .0 from whole numbers
        $grade = !empty($student['grade']) ? $student['grade'] : null;
        if ($grade !== null) {
            // If it's a whole number, store as integer, otherwise keep as decimal
            $grade = (float)$grade;
            if ($grade == (int)$grade) {
                $grade = (int)$grade;
            }
        }
        
        $submitted = ($student['submitted'] || $student['late']) ? 1 : 0;
        $late = $student['late'] ? 1 : 0;
        
        $stmt->execute([
            $grade,
            $submitted,
            $late,
            $submitted,
            $input['activity_ID'],
            $student['user_ID']
        ]);
    }

    $pdo->commit();
    echo json_encode(["success" => true, "message" => "Grades updated successfully"]);

} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(["success" => false, "message" => "Error updating grades: " . $e->getMessage()]);
}
?>