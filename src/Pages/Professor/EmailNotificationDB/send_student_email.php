<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/../../Landing/PHPMailer/src/Exception.php';
require_once __DIR__ . '/../../Landing/PHPMailer/src/PHPMailer.php';
require_once __DIR__ . '/../../Landing/PHPMailer/src/SMTP.php';

// SMTP Configuration
define("SMTP_HOST", "smtp.gmail.com");
define("SMTP_PORT", 587);
define("SMTP_USER", "tracked.0725@gmail.com");
define("SMTP_PASS", "nmvi itzx dqrh qimh");
define("FROM_EMAIL", "tracked.0725@gmail.com");
define("FROM_NAME", "TrackEd System");

function sendStudentEmailNotification($studentEmail, $studentName, $subject, $title, $message, $type = 'general') {
    try {
        $mail = new PHPMailer(true);

        // SMTP configuration
        $mail->isSMTP();
        $mail->Host = SMTP_HOST;
        $mail->SMTPAuth = true;
        $mail->Username = SMTP_USER;
        $mail->Password = SMTP_PASS;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = SMTP_PORT;
        $mail->SMTPDebug = 0;

        // Sender and recipient
        $mail->setFrom(FROM_EMAIL, FROM_NAME);
        $mail->addAddress($studentEmail, $studentName);
        $mail->addReplyTo(FROM_EMAIL, FROM_NAME);

        // Email content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = buildEmailBody($studentName, $title, $message, $type);
        $mail->AltBody = buildPlainTextBody($title, $message);

        return $mail->send();
    } catch (Exception $e) {
        error_log("Email sending failed for $studentEmail: " . $e->getMessage());
        return false;
    }
}

function buildEmailBody($studentName, $title, $message, $type) {
    $color = '#00A15D'; // Default green
    $icon = '📚';
    
    if ($type === 'failing') {
        $color = '#d9534f';
        $icon = '⚠️';
    } elseif ($type === 'deadline') {
        $color = '#f0ad4e';
        $icon = '📅';
    } elseif ($type === 'attendance') {
        $color = '#d9534f';
        $icon = '📊';
    }

    $html = '
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: ' . $color . '; margin-bottom: 20px; text-align: center;">' . $icon . ' TrackEd Notification</h2>
            
            <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Hi ' . htmlspecialchars($studentName) . ',</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; border-left: 4px solid ' . $color . '; margin-bottom: 20px;">
                <h3 style="color: ' . $color . '; margin-top: 0;">' . htmlspecialchars($title) . '</h3>
                <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0;">' . nl2br(htmlspecialchars($message)) . '</p>
            </div>';

    // Add special guidance for failing students
    if ($type === 'failing') {
        $html .= '
            <div style="background-color: #fff8e6; padding: 15px; border-radius: 5px; margin-bottom: 20px; border-left: 4px solid #f0ad4e;">
                <p style="margin: 0; color: #856404; font-size: 14px;">
                    <strong>💡 Recommended Action:</strong> Please approach your professor to discuss your performance and ask for a second chance or additional support.
                </p>
            </div>';
    }

    $html .= '
            <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin-top: 20px;">
                <p style="margin: 0; color: #155724; font-size: 14px;">
                    <strong>📱 Reminder:</strong> Check your TrackEd dashboard for more details and updates.
                </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 25px 0;">
            
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
                This is an automated notification. Please do not reply to this email.
            </p>
        </div>
    </div>';
    
    return $html;
}

function buildPlainTextBody($title, $message) {
    return "TrackEd Notification\n\n" .
           $title . "\n\n" .
           $message . "\n\n" .
           "Check your TrackEd dashboard for more details and updates.\n\n" .
           "This is an automated notification. Please do not reply to this email.";
}

// Function to send batch emails to students
function sendBatchStudentEmails($students, $subject, $title, $message, $type = 'general') {
    $results = [
        'success' => 0,
        'failed' => 0,
        'details' => []
    ];
    
    foreach ($students as $student) {
        $emailSent = sendStudentEmailNotification(
            $student['tracked_email'],
            $student['tracked_firstname'] . ' ' . $student['tracked_lastname'],
            $subject,
            $title,
            $message,
            $type
        );
        
        if ($emailSent) {
            $results['success']++;
            $results['details'][] = [
                'student_id' => $student['tracked_ID'],
                'email' => $student['tracked_email'],
                'status' => 'sent'
            ];
        } else {
            $results['failed']++;
            $results['details'][] = [
                'student_id' => $student['tracked_ID'],
                'email' => $student['tracked_email'],
                'status' => 'failed'
            ];
        }
    }
    
    return $results;
}

// Function to get students by subject code with correct column names
function getStudentsBySubject($pdo, $subject_code) {
    $stmt = $pdo->prepare("
        SELECT tu.tracked_ID, tu.tracked_email, tu.tracked_firstname, tu.tracked_lastname
        FROM tracked_users tu
        JOIN student_classes sc ON tu.tracked_ID = sc.student_ID
        WHERE sc.subject_code = ? AND sc.archived = 0 AND tu.tracked_Status = 'Active'
    ");
    $stmt->execute([$subject_code]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
?>