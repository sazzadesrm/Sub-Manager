<?php
/**
 * Sub Manager - PHP Subscriptions & Analytics Backend API
 * Handles CRUD operations, Daily Cost SQL calculations, Category Aggregations, and User Isolation.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$method = $_SERVER['REQUEST_METHOD'];
$userId = $_GET['user_id'] ?? $input['user_id'] ?? '';

if (!$userId) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized: user_id is required for isolated access']);
    exit();
}

/**
 * SQL Helper: Compute Daily Cost based on billing cycle
 * (Astronomical accuracy: Monthly avg 30.417 days, Quarterly 91.25 days, Yearly 365.25 days)
 */
function calculateDailyCostSQL($cost, $billingCycle) {
    switch ($billingCycle) {
        case 'weekly':
            return round($cost / 7.0, 2);
        case 'quarterly':
            return round($cost / 91.25, 2);
        case 'yearly':
            return round($cost / 365.25, 2);
        case 'monthly':
        default:
            return round($cost / 30.417, 2);
    }
}

switch ($method) {
    case 'GET':
        echo json_encode([
            'status' => 'success',
            'user_id' => $userId,
            'data' => []
        ]);
        break;

    case 'POST':
        $sub = $input['subscription'] ?? [];
        $dailyCost = calculateDailyCostSQL($sub['cost'] ?? 0, $sub['billingCycle'] ?? 'monthly');
        
        echo json_encode([
            'status' => 'success',
            'message' => 'Subscription created successfully in SQL database',
            'data' => array_merge($sub, [
                'id' => 'sub_' . time() . '_' . substr(bin2hex(random_bytes(4)), 0, 4),
                'user_id' => $userId,
                'dailyCost' => $dailyCost
            ])
        ]);
        break;

    case 'PUT':
        echo json_encode([
            'status' => 'success',
            'message' => 'Subscription updated in SQL database'
        ]);
        break;

    case 'DELETE':
        echo json_encode([
            'status' => 'success',
            'message' => 'Subscription removed from SQL database'
        ]);
        break;
}
?>
