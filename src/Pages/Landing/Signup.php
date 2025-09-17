<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

$servername = "localhost";
$username   = "root";
$password   = "";
$dbname     = "tracked";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// reCAPTCHA
$captcha = $_POST['captcha'] ?? '';
if (!$captcha) {
    echo "CAPCTHA missing.";
    exit;
}

$secretKey = "6LclQMwrAAAAAB9bcSEvD_48zHqCKaOt0KPQENUs";
$responseData = json_decode($verifyResponse);

// PPWEDE LANG TO PAG NAKA OFF UNG LINK SA MAY PHP.INI
// $ch = curl_init();
// curl_setopt($ch, CURLOPT_URL, "https://www.google.com/recaptcha/api/siteverify");
// curl_setopt($ch, CURLOPT_POST, 1);
// curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
//     'secret' => $secretKey,
//     'response' => $captcha
// ]));
// curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// $verifyResponse = curl_exec($ch);
// curl_close($ch);

// $responseData = json_decode($verifyResponse);


// if (!$responseData->success) {
//     echo "CAPTCHA verification failed.";
//     exit;
// }

$user_ID     = $_POST['tracked_ID'];
$user_email  = $_POST['tracked_email'];
$user_pass   = $_POST['tracked_password'];
$user_fname  = $_POST['tracked_fname'];
$user_lname  = $_POST['tracked_lname'];
$user_mi     = $_POST['tracked_mi'];
$user_prog   = $_POST['tracked_program'];
$user_bday   = $_POST['tracked_bday'];
$user_phone  = $_POST['tracked_phone'];

// hash the password
$hashed_pass = password_hash($user_pass, PASSWORD_BCRYPT);

// Step 1: check if user exists in whitelist (users table)
$check = $conn->prepare("SELECT user_ID, user_Role, user_Gender FROM users WHERE user_ID = ?");
$check->bind_param("s", $user_ID);
$check->execute();
$result = $check->get_result();

if ($row = $result->fetch_assoc()) {
    $role   = $row['user_Role'];
    $gender = $row['user_Gender'];

    // Step 2: insert into tracked_users with role & gender from users
    $insert = $conn->prepare("INSERT INTO tracked_users 
        (tracked_ID, Role, tracked_email, tracked_password, tracked_fname, tracked_lname, tracked_mi, tracked_program, tracked_bday, tracked_gender, tracked_phone, Status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active')");
    $insert->bind_param(
        "sssssssssss",
        $user_ID,
        $role,
        $user_email,
        $hashed_pass,
        $user_fname,
        $user_lname,
        $user_mi,
        $user_prog,
        $user_bday,
        $gender,
        $user_phone
    );

    if ($insert->execute()) {
        echo "Signup successful!";
    } else {
        echo "Error: " . $insert->error;
    }
} else {
    echo "Your account is not authorized to sign up.";
}

$conn->close();
