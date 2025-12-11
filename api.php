<?php
header('Content-Type: application/json');
$file = 'data.json';
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $input = file_get_contents('php://input');
    if (!empty($input)) {
        if (file_put_contents($file, $input)) {
            echo json_encode(['status' => 'success', 'message' => 'Saved']);
        } else {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Write error']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Empty data']);
    }
} elseif ($method === 'GET') {
    if (file_exists($file)) {
        echo file_get_contents($file);
    } else {
        echo json_encode([]);
    }
}
?>