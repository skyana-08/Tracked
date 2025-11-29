<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Your React dev server
header("Access-Control-Allow-Origin: http://localhost"); // Your production
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Database configuration for localhost
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "tracked";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

class SemesterSettings {
    private $conn;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    // Get current semester status
    public function getSemesterStatus() {
        $query = "SELECT class_semester, semester_status FROM tracked_semester";
        $stmt = $this->conn->prepare($query);
        
        if (!$stmt) {
            return ["success" => false, "message" => "Prepare failed: " . $this->conn->error];
        }
        
        $stmt->execute();
        $result = $stmt->get_result();
        $semesters = array();
        
        while ($row = $result->fetch_assoc()) {
            $semesters[$row['class_semester']] = $row['semester_status'];
        }
        
        $stmt->close();
        return $semesters;
    }
    
    // Update semester status
    public function updateSemesterStatus($semester, $status) {
        // First, set all semesters to INACTIVE
        $deactivateQuery = "UPDATE tracked_semester SET semester_status = 'INACTIVE'";
        $deactivateStmt = $this->conn->prepare($deactivateQuery);
        
        if (!$deactivateStmt) {
            return ["success" => false, "message" => "Prepare failed: " . $this->conn->error];
        }
        
        $deactivateStmt->execute();
        $deactivateStmt->close();
        
        // If we're activating a semester, set it to ACTIVE
        if ($status === 'ACTIVE') {
            $activateQuery = "UPDATE tracked_semester SET semester_status = 'ACTIVE' WHERE class_semester = ?";
            $activateStmt = $this->conn->prepare($activateQuery);
            
            if (!$activateStmt) {
                return ["success" => false, "message" => "Prepare failed: " . $this->conn->error];
            }
            
            $activateStmt->bind_param("s", $semester);
            
            if ($activateStmt->execute()) {
                $activateStmt->close();
                return ["success" => true, "message" => "Semester activated successfully"];
            } else {
                $activateStmt->close();
                return ["success" => false, "message" => "Failed to activate semester"];
            }
        } else {
            return ["success" => true, "message" => "All semesters deactivated"];
        }
    }
}

$semesterSettings = new SemesterSettings($conn);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $semesters = $semesterSettings->getSemesterStatus();
        if (isset($semesters['success']) && !$semesters['success']) {
            echo json_encode($semesters);
        } else {
            echo json_encode([
                "success" => true,
                "data" => $semesters
            ]);
        }
        break;
        
    case 'POST':
    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        
        if (isset($data->semester) && isset($data->status)) {
            $result = $semesterSettings->updateSemesterStatus($data->semester, $data->status);
            echo json_encode($result);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Missing required parameters: semester and status"
            ]);
        }
        break;
        
    default:
        echo json_encode([
            "success" => false,
            "message" => "Method not allowed"
        ]);
        break;
}

$conn->close();
?>