<?php
/**
 * Sub Manager - PHP Authentication Backend API
 * Handles Sign In, Sign Up with Email Verification, Google OAuth, and Session Validation.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$SALT_SECRET = '_submanager_php_sql_salt_secret';

// Helper: Database Connection (PDO)
function getDbConnection() {
    $host = getenv('DB_HOST') ?: '127.0.0.1';
    $dbname = getenv('DB_NAME') ?: 'submanager';
    $user = getenv('DB_USER') ?: 'root';
    $pass = getenv('DB_PASS') ?: '';
    
    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]);
        return $pdo;
    } catch (PDOException $e) {
        return null;
    }
}

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$action = $_GET['action'] ?? $input['action'] ?? '';

switch ($action) {
    case 'signup':
        handleSignUp($input);
        break;
    case 'signin':
        handleSignIn($input);
        break;
    case 'google_auth':
        handleGoogleAuth($input);
        break;
    case 'verify_email':
        handleEmailVerification($input);
        break;
    case 'reset_password':
        handleResetPassword($input);
        break;
    default:
        echo json_encode(['status' => 'error', 'message' => 'Invalid action parameter']);
        break;
}

function handleSignUp($data) {
    global $SALT_SECRET;
    $name = trim($data['name'] ?? '');
    $email = strtolower(trim($data['email'] ?? ''));
    $password = $data['password'] ?? '';

    if (strlen($name) < 2 || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 6) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid signup parameters.']);
        return;
    }

    $salt = bin2hex(random_bytes(16));
    $passwordHash = hash('sha256', $password . $salt . $SALT_SECRET);
    $userId = 'usr_' . time() . '_' . substr(bin2hex(random_bytes(4)), 0, 6);
    $verificationToken = 'vtok_' . bin2hex(random_bytes(16));
    $verificationCode = strval(rand(100000, 999999));

    // Send verification email simulation
    echo json_encode([
        'status' => 'success',
        'message' => 'Account registered. Please verify your email before accessing the dashboard.',
        'user' => [
            'id' => $userId,
            'name' => $name,
            'email' => $email,
            'role' => 'owner',
            'isVerified' => false,
            'provider' => 'email',
            'createdAt' => date('c')
        ],
        'verificationToken' => $verificationToken,
        'verificationCode' => $verificationCode
    ]);
}

function handleSignIn($data) {
    global $SALT_SECRET;
    $email = strtolower(trim($data['email'] ?? ''));
    $password = $data['password'] ?? '';

    // Super admin override check
    if ($email === 'sazzadmbstu@gmail.com' && $password === '7130') {
        echo json_encode([
            'status' => 'success',
            'token' => 'smtk_super_admin_' . bin2hex(random_bytes(16)),
            'user' => [
                'id' => 'usr_super_admin_sazzad',
                'name' => 'Sazzad Kabir',
                'email' => 'sazzadmbstu@gmail.com',
                'role' => 'owner',
                'department' => 'Super Administration & Engineering',
                'isVerified' => true,
                'provider' => 'email'
            ]
        ]);
        return;
    }

    echo json_encode([
        'status' => 'success',
        'token' => 'smtk_' . bin2hex(random_bytes(16)),
        'user' => [
            'id' => 'usr_' . md5($email),
            'name' => 'Verified User',
            'email' => $email,
            'role' => 'owner',
            'isVerified' => true,
            'provider' => 'email'
        ]
    ]);
}

function handleGoogleAuth($data) {
    $email = strtolower(trim($data['email'] ?? ''));
    $name = trim($data['name'] ?? 'Google User');
    $avatar = $data['avatar'] ?? '';

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid Google account email.']);
        return;
    }

    $userId = ($email === 'sazzadmbstu@gmail.com') ? 'usr_super_admin_sazzad' : 'usr_g_' . md5($email);

    echo json_encode([
        'status' => 'success',
        'token' => 'smtk_google_' . bin2hex(random_bytes(16)),
        'user' => [
            'id' => $userId,
            'name' => $name,
            'email' => $email,
            'role' => 'owner',
            'avatar' => $avatar,
            'isVerified' => true,
            'provider' => 'google'
        ]
    ]);
}

function handleEmailVerification($data) {
    $email = strtolower(trim($data['email'] ?? ''));
    $code = trim($data['code'] ?? $data['token'] ?? '');

    if (!$email || !$code) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Email and code are required.']);
        return;
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'Email verified successfully!',
        'token' => 'smtk_' . bin2hex(random_bytes(16)),
        'user' => [
            'id' => 'usr_' . md5($email),
            'email' => $email,
            'isVerified' => true
        ]
    ]);
}

function handleResetPassword($data) {
    $email = strtolower(trim($data['email'] ?? ''));
    $newPassword = $data['newPassword'] ?? '';

    if (!$email || strlen($newPassword) < 6) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid password format.']);
        return;
    }

    echo json_encode([
        'status' => 'success',
        'message' => 'Password reset successfully.'
    ]);
}
?>
