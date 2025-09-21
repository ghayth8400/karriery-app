<?php
require_once '../database/db_config.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

if ($method === 'POST') {
    try {
        $userId = null;
        if (isset($input['token'])) {
            $stmt = $db->prepare("
                SELECT u.id FROM users u 
                JOIN user_sessions s ON u.id = s.user_id 
                WHERE s.session_token = ? AND s.expires_at > NOW()
            ");
            $stmt->execute([$input['token']]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($user) {
                $userId = $user['id'];
            }
        }
        
        $stmt = $db->prepare("INSERT INTO contact_requests (name, email, message, user_id) VALUES (?, ?, ?, ?)");
        $stmt->execute([$input['name'], $input['email'], $input['message'], $userId]);
        
        echo json_encode(['success' => true, 'message' => 'Message sent successfully']);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to send message']);
    }
}
?>

