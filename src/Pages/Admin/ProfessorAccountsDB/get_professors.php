<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "tracked");

if ($conn->connect_error) {
  die(json_encode([]));
}

$sql = "SELECT *
        FROM tracked_users
        WHERE tracked_Role = 'Professor'
        ORDER BY tracked_ID ASC";

$result = $conn->query($sql);

$data = [];
if ($result && $result->num_rows > 0) {
  while ($row = $result->fetch_assoc()) {
    $data[] = $row;
  }
}

echo json_encode($data);
$conn->close();
?>
