<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "tracked";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
  die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_FILES["sqlFile"])) {
  $fileTmpPath = $_FILES["sqlFile"]["tmp_name"];
  $sqlContent = file_get_contents($fileTmpPath);

  // 🧹 Remove CREATE, DROP, and ALTER statements
  $cleanedSQL = preg_replace(
    '/(CREATE TABLE|DROP TABLE|ALTER TABLE)[^;]*;/i',
    '',
    $sqlContent
  );

  // 🪄 Convert normal INSERT INTO → REPLACE INTO (to avoid duplicates)
  $cleanedSQL = str_ireplace("INSERT INTO", "REPLACE INTO", $cleanedSQL);

  // 🧠 Optionally, ensure all inserts target the `Users` table
  $cleanedSQL = preg_replace('/REPLACE INTO\s+`?\w+`?/i', 'REPLACE INTO Users', $cleanedSQL);

  if ($conn->multi_query($cleanedSQL)) {
    echo json_encode(["success" => true, "message" => "Database imported successfully!"]);
  } else {
    echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
  }
} else {
  echo json_encode(["success" => false, "message" => "No file uploaded or invalid request."]);
}

$conn->close();
?>
