<?php
require_once '../database/db_config.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

// Verify admin access
function verifyAdmin($db, $token) {
    $stmt = $db->prepare("
        SELECT u.* FROM users u 
        JOIN user_sessions s ON u.id = s.user_id 
        WHERE s.session_token = ? AND s.expires_at > NOW() AND u.is_admin = TRUE
    ");
    $stmt->execute([$token]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

switch($method) {
    case 'GET':
        if (isset($_GET['action'])) {
            switch($_GET['action']) {
                case 'contacts':
                    getContactRequests($db, $_GET['token']);
                    break;
                case 'users':
                    getUsers($db, $_GET['token']);
                    break;
            }
        }
        break;
    case 'PUT':
        if (isset($input['action'])) {
            switch($input['action']) {
                case 'update_contact_status':
                    updateContactStatus($db, $input);
                    break;
            }
        }
        break;
}

function getContactRequests($db, $token) {
    $admin = verifyAdmin($db, $token);
    if (!$admin) {
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        return;
    }
    
    try {
        $stmt = $db->prepare("SELECT * FROM contact_requests ORDER BY created_at DESC");
        $stmt->execute();
        $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode(['success' => true, 'requests' => $requests]);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to fetch requests']);
    }
}

function getUsers($db, $token) {
    $admin = verifyAdmin($db, $token);
    if (!$admin) {
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        return;
    }
    
    try {
        $stmt = $db->prepare("SELECT id, username, email, full_name, profile_image, is_admin, created_at FROM users ORDER BY created_at DESC");
        $stmt->execute();
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode(['success' => true, 'users' => $users]);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to fetch users']);
    }
}

function updateContactStatus($db, $data) {
    $admin = verifyAdmin($db, $data['token']);
    if (!$admin) {
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        return;
    }
    
    try {
        $stmt = $db->prepare("UPDATE contact_requests SET status = ? WHERE id = ?");
        $stmt->execute([$data['status'], $data['request_id']]);
        
        echo json_encode(['success' => true, 'message' => 'Status updated']);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Update failed']);
    }
}
?>

