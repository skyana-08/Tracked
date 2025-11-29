<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$servername = "localhost";
$username = "u713320770_trackedDB";
$password = "Tracked@2025";
$dbname = "u713320770_tracked";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
  die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_FILES["sqlFile"])) {
  // Check for upload errors
  if ($_FILES["sqlFile"]["error"] !== UPLOAD_ERR_OK) {
    echo json_encode(["success" => false, "message" => "File upload error: " . $_FILES["sqlFile"]["error"]]);
    exit;
  }

  $fileTmpPath = $_FILES["sqlFile"]["tmp_name"];
  $fileName = $_FILES["sqlFile"]["name"];
  
  // Validate file type
  $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
  if ($fileExtension !== 'sql') {
    echo json_encode(["success" => false, "message" => "Invalid file type. Please upload an SQL file."]);
    exit;
  }

  // Read SQL file
  $sqlContent = file_get_contents($fileTmpPath);
  if ($sqlContent === false) {
    echo json_encode(["success" => false, "message" => "Unable to read SQL file."]);
    exit;
  }

  // Remove BOM if present
  $sqlContent = preg_replace('/^\xEF\xBB\xBF/', '', $sqlContent);

  try {
    // Extract only INSERT statements
    preg_match_all('/INSERT\s+INTO[^;]*;/i', $sqlContent, $insertStatements);
    
    if (empty($insertStatements[0])) {
      echo json_encode(["success" => false, "message" => "No INSERT statements found in the SQL file."]);
      exit;
    }

    $successCount = 0;
    $errorCount = 0;
    $errors = [];

    // Execute each INSERT statement individually
    foreach ($insertStatements[0] as $insertStatement) {
      // Convert to REPLACE INTO to handle duplicates
      $replaceStatement = preg_replace('/INSERT\s+INTO/i', 'REPLACE INTO', $insertStatement);
      
      if ($conn->query($replaceStatement) === TRUE) {
        $successCount++;
      } else {
        $errorCount++;
        $errors[] = $conn->error;
      }
    }

    if ($errorCount > 0) {
      echo json_encode([
        "success" => false, 
        "message" => "Completed with errors: {$successCount} successful, {$errorCount} failed.",
        "details" => $errors
      ]);
    } else {
      echo json_encode([
        "success" => true, 
        "message" => "Successfully imported {$successCount} records!"
      ]);
    }

  } catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
  }
} else {
  echo json_encode(["success" => false, "message" => "No file uploaded or invalid request."]);
}

$conn->close();
?>