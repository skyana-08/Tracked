<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "u713320770_trackedDB", "Tracked@2025", "u713320770_tracked");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}

// Get detailed counts of students by section and year level
$sql = "SELECT 
            SUBSTRING(tracked_yearandsec, 2) as section,
            SUBSTRING(tracked_yearandsec, 1, 1) as year_level,
            COUNT(*) as student_count
        FROM tracked_users 
        WHERE tracked_Role = 'Student' 
        AND tracked_yearandsec IS NOT NULL 
        AND tracked_yearandsec != ''
        GROUP BY SUBSTRING(tracked_yearandsec, 2), SUBSTRING(tracked_yearandsec, 1, 1)
        ORDER BY section, year_level";

$result = $conn->query($sql);

$sectionDetails = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $section = $row['section'];
        $yearLevel = $row['year_level'];
        $count = (int)$row['student_count'];
        
        if (!isset($sectionDetails[$section])) {
            $sectionDetails[$section] = [
                'total' => 0,
                'yearLevels' => []
            ];
        }
        
        $sectionDetails[$section]['total'] += $count;
        $sectionDetails[$section]['yearLevels'][$yearLevel] = $count;
    }
}

// Ensure all sections A-G are represented, even if empty
$allSections = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
$finalDetails = [];
foreach ($allSections as $section) {
    if (isset($sectionDetails[$section])) {
        $finalDetails[$section] = $sectionDetails[$section];
    } else {
        $finalDetails[$section] = [
            'total' => 0,
            'yearLevels' => []
        ];
    }
}

echo json_encode($finalDetails);

$conn->close();
?>