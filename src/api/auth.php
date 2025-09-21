<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
require_once '../database/db_config.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch($method) {
    case 'POST':
        if (isset($input['action'])) {
            switch($input['action']) {
                case 'login':
                    login($db, $input);
                    break;
                case 'register':
                    register($db, $input);
                    break;
                case 'logout':
                    logout($db, $input);
                    break;
            }
        }
        break;
    case 'GET':
        if (isset($_GET['action']) && $_GET['action'] === 'verify') {
            verifyToken($db, $_GET['token']);
        }
        break;
}

function login($db, $data) {
    try {
        $stmt = $db->prepare("SELECT * FROM users WHERE username = ? OR email = ?");
        $stmt->execute([$data['username'], $data['username']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user && password_verify($data['password'], $user['password_hash'])) {
            $token = bin2hex(random_bytes(32));
            $expires = date('Y-m-d H:i:s', strtotime('+7 days'));
            
            $stmt = $db->prepare("INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)");
            $stmt->execute([$user['id'], $token, $expires]);
            
            unset($user['password_hash']);
            
            echo json_encode([
                'success' => true,
                'user' => $user,
                'token' => $token
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
        }
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Login failed']);
    }
}

function register($db, $data) {
    try {
        $stmt = $db->prepare("SELECT COUNT(*) FROM users WHERE username = ? OR email = ?");
        $stmt->execute([$data['username'], $data['email']]);
        
        if ($stmt->fetchColumn() > 0) {
            echo json_encode(['success' => false, 'message' => 'Username or email already exists']);
            return;
        }
        
        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
        
        $stmt = $db->prepare("INSERT INTO users (username, email, password_hash, full_name) VALUES (?, ?, ?, ?)");
        $stmt->execute([$data['username'], $data['email'], $hashedPassword, $data['full_name']]);
        
        $userId = $db->lastInsertId();
        
        $stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        unset($user['password_hash']);
        
        $token = bin2hex(random_bytes(32));
        $expires = date('Y-m-d H:i:s', strtotime('+7 days'));
        
        $stmt = $db->prepare("INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)");
        $stmt->execute([$userId, $token, $expires]);
        
        echo json_encode([
            'success' => true,
            'user' => $user,
            'token' => $token
        ]);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Registration failed']);
    }
}

function verifyToken($db, $token) {
    try {
        $stmt = $db->prepare("
            SELECT u.* FROM users u 
            JOIN user_sessions s ON u.id = s.user_id 
            WHERE s.session_token = ? AND s.expires_at > NOW()
        ");
        $stmt->execute([$token]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user) {
            unset($user['password_hash']);
            echo json_encode(['success' => true, 'user' => $user]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid or expired token']);
        }
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Verification failed']);
    }
}

function logout($db, $data) {
    try {
        $stmt = $db->prepare("DELETE FROM user_sessions WHERE session_token = ?");
        $stmt->execute([$data['token']]);
        echo json_encode(['success' => true]);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Logout failed']);
    }
}
?>

