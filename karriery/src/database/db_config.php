<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

class Database {
    private $host = "localhost";
    private $username = "root";
    private $password = "";
    private $database = "business_platform";
    private $conn;

    public function __construct() {
        try {
            $this->conn = new PDO("mysql:host=".$this->host.";dbname=".$this->database, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $e) {
            echo json_encode(['error' => 'Connection failed: ' . $e->getMessage()]);
            exit();
        }
    }

    public function getConnection() {
        return $this->conn;
    }
}

// Create database and tables
function initDatabase() {
    $host = "localhost";
    $username = "root";
    $password = "";
    
    try {
        // Create database
        $conn = new PDO("mysql:host=$host", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        $conn->exec("CREATE DATABASE IF NOT EXISTS business_platform");
        $conn->exec("USE business_platform");
        
        // Create users table
        $conn->exec("CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            full_name VARCHAR(100) NOT NULL,
            profile_image VARCHAR(255) DEFAULT NULL,
            bio TEXT DEFAULT NULL,
            is_admin BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )");
        
        // Create contact_requests table
        $conn->exec("CREATE TABLE IF NOT EXISTS contact_requests (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            message TEXT NOT NULL,
            status ENUM('pending', 'read', 'replied') DEFAULT 'pending',
            user_id INT DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        )");
        
        // Create sessions table
        $conn->exec("CREATE TABLE IF NOT EXISTS user_sessions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            session_token VARCHAR(255) UNIQUE NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )");
        
        // Create admin user if not exists
        $stmt = $conn->prepare("SELECT COUNT(*) FROM users WHERE is_admin = TRUE");
        $stmt->execute();
        $adminCount = $stmt->fetchColumn();
        
        if ($adminCount == 0) {
            $adminPassword = password_hash('admin123', PASSWORD_DEFAULT);
            $stmt = $conn->prepare("INSERT INTO users (username, email, password_hash, full_name, is_admin) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute(['admin', 'admin@company.com', $adminPassword, 'System Administrator', true]);
        }
        
    } catch(PDOException $e) {
        echo json_encode(['error' => 'Database initialization failed: ' . $e->getMessage()]);
        exit();
    }
}

// Initialize database on first load
initDatabase();
?>

