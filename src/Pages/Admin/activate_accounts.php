<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "tracked";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => $conn->connect_error]));
}

// Fetch all users from the users table
$sql = "SELECT * FROM users";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $user_ID = $row['user_ID'];
        $user_firstname = $row['user_firstname'];
        $user_middlename = $row['user_middlename'];
        $user_lastname = $row['user_lastname'];
        $user_Email = $row['user_Email'];
        $user_phonenumber = $row['user_phonenumber'];
        $user_bday = $row['user_bday'];
        $user_Gender = $row['user_Gender'];
        $user_Role = $row['user_Role'];
        $user_yearandsection = $row['user_yearandsection'];
        $user_program = $row['user_program'];
        $user_semester = $row['user_semester'];

        // Generate random password based on bday, role, and ID
        $bday = str_replace("/", "", $user_bday); // e.g. 01012001
        $random = substr(str_shuffle("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"), 0, 3);
        $plain_password = $bday . $user_Role . $user_ID . $random;
        $hashed_password = password_hash($plain_password, PASSWORD_DEFAULT);

        // Check if the user already exists in tracked_users
        $check_sql = "SELECT tracked_ID FROM tracked_users WHERE tracked_ID = '$user_ID'";
        $check_result = $conn->query($check_sql);

        if ($check_result->num_rows == 0) {
            // Insert new record
            $insert_sql = "INSERT INTO tracked_users (
                tracked_ID, tracked_Role, tracked_email, tracked_password,
                tracked_firstname, tracked_lastname, tracked_middlename,
                tracked_program, tracked_yearandsec, tracked_semester, tracked_bday,
                tracked_gender, tracked_phone, tracked_Status
            ) VALUES (
                '$user_ID', '$user_Role', '$user_Email', '$hashed_password',
                '$user_firstname', '$user_lastname', '$user_middlename',
                '$user_program', '$user_yearandsection', '$user_semester',
                STR_TO_DATE('$user_bday', '%m/%d/%Y'),
                '$user_Gender', '$user_phonenumber', 'Active'
            )";

            $conn->query($insert_sql);
        } else {
            // Update existing record
            $update_sql = "UPDATE tracked_users SET
                tracked_Role = '$user_Role',
                tracked_email = '$user_Email',
                tracked_firstname = '$user_firstname',
                tracked_lastname = '$user_lastname',
                tracked_middlename = '$user_middlename',
                tracked_program = '$user_program',
                tracked_yearandsec = '$user_yearandsection',
                tracked_semester = '$user_semester',
                tracked_bday = STR_TO_DATE('$user_bday', '%m/%d/%Y'),
                tracked_gender = '$user_Gender',
                tracked_phone = '$user_phonenumber'
            WHERE tracked_ID = '$user_ID'";

            $conn->query($update_sql);
        }
    }

    echo json_encode(["status" => "success", "message" => "Users synced successfully between tables."]);
} else {
    echo json_encode(["status" => "error", "message" => "No users found in source table."]);
}

$conn->close();
?>
