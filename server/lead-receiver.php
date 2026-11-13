<?php
declare(strict_types=1);

header('Content-Type: text/plain; charset=utf-8');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    http_response_code(405);
    exit('Method not allowed');
}

$body = file_get_contents('php://input', false, null, 0, 16385);
$lead = is_string($body) ? json_decode($body, true) : null;
if (!is_array($lead) || strlen($body) > 16384 || !is_string($lead['source'] ?? null)) {
    http_response_code(400);
    exit('Invalid request');
}

$endpoint = __LEADS_ENDPOINT__;
$request = curl_init($endpoint);
curl_setopt_array($request, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $body,
    CURLOPT_HTTPHEADER => ['Content-Type: text/plain; charset=utf-8'],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_REDIR_PROTOCOLS => CURLPROTO_HTTPS,
    CURLOPT_MAXREDIRS => 3,
    CURLOPT_CONNECTTIMEOUT => 5,
    CURLOPT_TIMEOUT => 25,
]);

$response = curl_exec($request);
$status = curl_getinfo($request, CURLINFO_HTTP_CODE);
curl_close($request);

if ($status !== 200 || !is_string($response) || trim($response) !== 'ok') {
    http_response_code(502);
    exit('Lead was not acknowledged');
}

echo 'ok';
