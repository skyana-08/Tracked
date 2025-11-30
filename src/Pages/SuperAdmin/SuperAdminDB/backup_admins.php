<?php
header('Content-Type: application/sql');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

$servername = "localhost";
$username = "u713320770_trackedDB";
$password = "Tracked@2025";
$dbname = "u713320770_tracked";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get only admin accounts (role = 'Admin')
    $stmt = $conn->prepare("SELECT * FROM tracked_users WHERE tracked_Role = 'Admin'");
    $stmt->execute();
    $admins = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Generate SQL file content
    $sqlContent = "-- TrackEd Admins Backup\n";
    $sqlContent .= "-- Generated: " . date('Y-m-d H:i:s') . "\n\n";
    
    foreach ($admins as $admin) {
        $values = [];
        foreach ($admin as $key => $value) {
            if ($value === null) {
                $values[] = "NULL";
            } else {
                $values[] = $conn->quote($value);
            }
        }
        
        $sqlContent .= "INSERT INTO tracked_users (" . implode(', ', array_keys($admin)) . ") ";
        $sqlContent .= "VALUES (" . implode(', ', $values) . ") ";
        $sqlContent .= "ON DUPLICATE KEY UPDATE ";
        
        $updates = [];
        foreach ($admin as $key => $value) {
            if ($key !== 'tracked_ID') {
                $updates[] = "$key = " . ($value === null ? "NULL" : $conn->quote($value));
            }
        }
        $sqlContent .= implode(', ', $updates) . ";\n";
    }

    // Save to Hostinger backup folder
    $backupDir = __DIR__ . '/../../Backups/backup_for_tracked_admins/';
    if (!is_dir($backupDir)) {
        mkdir($backupDir, 0777, true);
    }
    
    $filename = 'admins_backup_' . date('Y-m-d_H-i-s') . '.sql';
    $filepath = $backupDir . $filename;
    
    // Save to server
    file_put_contents($filepath, $sqlContent);
    
    // Force download
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('Content-Length: ' . strlen($sqlContent));
    echo $sqlContent;

} catch (Exception $e) {
    header('Content-Type: text/plain');
    echo "Backup Error: " . $e->getMessage();
}
?>