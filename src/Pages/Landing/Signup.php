<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Clear any output buffers to prevent unwanted output
while (ob_get_level()) {
    ob_end_clean();
}

// Set headers FIRST to prevent any output issues
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

// Database connection settings - UPDATED FOR HOST
$dbHost = "mysql.tracked.6minds.site";
$dbUser = "u713320770_trackedDB";
$dbPass = "Tracked@2025";
$dbName = "u713320770_tracked";

// Create DB connection
$conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed: " . $conn->connect_error]);
    exit;
}
$conn->set_charset('utf8mb4');

// Read JSON input
$raw = file_get_contents("php://input");
if (empty($raw)) {
    echo json_encode(["success" => false, "message" => "No data received"]);
    exit;
}

$data = json_decode($raw, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(["success" => false, "message" => "Invalid JSON data"]);
    exit;
}

// Get POST data - using JSON input instead of $_POST
$user_ID     = $data['tracked_ID'] ?? '';
$user_email  = $data['tracked_email'] ?? '';
$user_pass   = $data['tracked_password'] ?? '';
$user_fname  = $data['tracked_fname'] ?? '';
$user_lname  = $data['tracked_lname'] ?? '';
$user_mi     = $data['tracked_mi'] ?? '';
$user_prog   = $data['tracked_program'] ?? '';
$user_bday   = $data['tracked_bday'] ?? '';
$user_phone  = $data['tracked_phone'] ?? '';

// Validate required fields
if (empty($user_ID) || empty($user_email) || empty($user_pass) || empty($user_fname) || empty($user_lname)) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

// Hash the password PROPERLY
$hashed_pass = password_hash($user_pass, PASSWORD_DEFAULT);

// DEBUG: Log the password hashing
error_log("=== SIGNUP ATTEMPT ===");
error_log("User ID: " . $user_ID);
error_log("Plain password: " . $user_pass);
error_log("Hashed password: " . $hashed_pass);

// Step 1: Check if user exists in whitelist (users table)
$check = $conn->prepare("SELECT user_ID, user_Role, user_Gender, YearandSection FROM users WHERE user_ID = ?");
if (!$check) {
    echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
    $conn->close();
    exit;
}

$check->bind_param("s", $user_ID);
$check->execute();
$result = $check->get_result();

if ($row = $result->fetch_assoc()) {
    $role   = $row['user_Role'] ?? 'Student';
    $gender = $row['user_Gender'] ?? '';
    $yas = $row['YearandSection'] ?? '';
    
    // Step 2: Check if user already registered in tracked_users
    $check_tracked = $conn->prepare("SELECT tracked_ID FROM tracked_users WHERE tracked_ID = ?");
    if (!$check_tracked) {
        echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
        $check->close();
        $conn->close();
        exit;
    }
    
    $check_tracked->bind_param("s", $user_ID);
    $check_tracked->execute();
    $tracked_result = $check_tracked->get_result();
    
    if ($tracked_result->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "User already registered in TrackED system!"]);
        $check_tracked->close();
        $check->close();
        $conn->close();
        exit;
    }
    $check_tracked->close();

    // Step 3: Insert into tracked_users
    $insert = $conn->prepare("INSERT INTO tracked_users 
        (tracked_ID, tracked_Role, tracked_email, tracked_password, tracked_firstname, tracked_lastname, tracked_middlename, tracked_program, tracked_yearandsec, tracked_birthday, tracked_gender, tracked_phone, tracked_Status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active')");
    
    if (!$insert) {
        echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
        $check->close();
        $conn->close();
        exit;
    }

    $insert->bind_param(
        "ssssssssssss",
        $user_ID,
        $role,
        $user_email,
        $hashed_pass,
        $user_fname,
        $user_lname,
        $user_mi,
        $user_prog,
        $yas,
        $user_bday,
        $gender,
        $user_phone
    );

    if ($insert->execute()) {
        // Verify the stored data
        $verify = $conn->prepare("SELECT tracked_password FROM tracked_users WHERE tracked_ID = ?");
        $verify->bind_param("s", $user_ID);
        $verify->execute();
        $verify->bind_result($stored_hash);
        $verify->fetch();
        $verify->close();
        
        error_log("Stored hash in DB: " . $stored_hash);
        error_log("Password verify test: " . (password_verify($user_pass, $stored_hash) ? "SUCCESS" : "FAILED"));
        
        echo json_encode(["success" => true, "message" => "Signup successful!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Registration failed: " . $insert->error]);
    }
    
    $insert->close();
} else {
    echo json_encode(["success" => false, "message" => "Your account is not authorized to sign up. Please contact administrator."]);
}

$check->close();
$conn->close();
exit;
?>