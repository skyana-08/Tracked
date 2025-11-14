<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$servername = "localhost";
$username = "u713320770_trackedDB";
$password = "Tracked@2025";
$dbname = "u713320770_tracked";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
  die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Count professors and students with status
$profQuery = "SELECT tracked_Status, COUNT(*) AS count FROM tracked_users WHERE tracked_Role = 'Professor' GROUP BY tracked_Status";
$studQuery = "SELECT tracked_Status, COUNT(*) AS count FROM tracked_users WHERE tracked_Role = 'Student' GROUP BY tracked_Status";

$profResult = $conn->query($profQuery);
$studResult = $conn->query($studQuery);

// Initialize counts
$professors = 0;
$students = 0;
$activeProfessors = 0;
$deactivatedProfessors = 0;
$activeStudents = 0;
$deactivatedStudents = 0;

// Process professor counts
if ($profResult) {
    while ($row = $profResult->fetch_assoc()) {
        $professors += $row['count'];
        if ($row['tracked_Status'] === 'Active') {
            $activeProfessors = $row['count'];
        } else if ($row['tracked_Status'] === 'Deactivate') {
            $deactivatedProfessors = $row['count'];
        }
    }
}

// Process student counts
if ($studResult) {
    while ($row = $studResult->fetch_assoc()) {
        $students += $row['count'];
        if ($row['tracked_Status'] === 'Active') {
            $activeStudents = $row['count'];
        } else if ($row['tracked_Status'] === 'Deactivate') {
            $deactivatedStudents = $row['count'];
        }
    }
}

echo json_encode([
  "Professors" => $professors,
  "Students" => $students,
  "ActiveProfessors" => $activeProfessors,
  "DeactivatedProfessors" => $deactivatedProfessors,
  "ActiveStudents" => $activeStudents,
  "DeactivatedStudents" => $deactivatedStudents,
  "TotalActive" => $activeProfessors + $activeStudents,
  "TotalDeactivated" => $deactivatedProfessors + $deactivatedStudents
]);

$conn->close();
?>