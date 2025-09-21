<?php
require_once '../database/db_config.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'PUT':
        updateProfile($db);
        break;
    case 'POST':
        if (isset($_FILES['profile_image'])) {
            uploadProfileImage($db);
        }
        break;
}

function updateProfile($db) {
    $input = json_decode(file_get_contents('php://input'), true);
    $token = $input['token'];
    
    try {
        $stmt = $db->prepare("
            SELECT u.id FROM users u 
            JOIN user_sessions s ON u.id = s.user_id 
            WHERE s.session_token = ? AND s.expires_at > NOW()
        ");
        $stmt->execute([$token]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user) {
            echo json_encode(['success' => false, 'message' => 'Unauthorized']);
            return;
        }
        
        $stmt = $db->prepare("UPDATE users SET full_name = ?, bio = ? WHERE id = ?");
        $stmt->execute([$input['full_name'], $input['bio'], $user['id']]);
        
        echo json_encode(['success' => true, 'message' => 'Profile updated successfully']);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Update failed']);
    }
}

function uploadProfileImage($db) {
    $token = $_POST['token'];
    
    try {
        $stmt = $db->prepare("
            SELECT u.id FROM users u 
            JOIN user_sessions s ON u.id = s.user_id 
            WHERE s.session_token = ? AND s.expires_at > NOW()
        ");
        $stmt->execute([$token]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user) {
            echo json_encode(['success' => false, 'message' => 'Unauthorized']);
            return;
        }
        
        $uploadDir = '../uploads/profiles/';
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        
        $fileName = $user['id'] . '_' . time() . '.' . pathinfo($_FILES['profile_image']['name'], PATHINFO_EXTENSION);
        $uploadPath = $uploadDir . $fileName;
        
        if (move_uploaded_file($_FILES['profile_image']['tmp_name'], $uploadPath)) {
            $stmt = $db->prepare("UPDATE users SET profile_image = ? WHERE id = ?");
            $stmt->execute([$fileName, $user['id']]);
            
            echo json_encode(['success' => true, 'profile_image' => $fileName]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Upload failed']);
        }
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Upload failed']);
    }
}
?>

