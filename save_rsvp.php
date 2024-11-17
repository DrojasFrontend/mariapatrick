<?php
header('Content-Type: application/json');

// Recibir datos JSON
$data = json_decode(file_get_contents('php://input'), true);

// Validar datos recibidos
if (!$data || !isset($data['invitado']) || !isset($data['email'])) {
    echo json_encode(['success' => false, 'message' => 'Datos incompletos']);
    exit;
}

// Preparar el mensaje de correo
$to = 'rsvp@boda.com';
$subject = 'Nueva confirmación RSVP - ' . $data['invitado']['nombre_completo'];

$message = "Nueva confirmación de asistencia:\n\n";
$message .= "Nombre: " . $data['invitado']['nombre_completo'] . "\n";
$message .= "Email: " . $data['email'] . "\n";
$message .= "Teléfono: " . $data['telefono'] . "\n\n";
$message .= "Confirmaciones:\n";
if (isset($data['confirmaciones']['boda'])) {
    $message .= "Boda: " . ($data['confirmaciones']['boda'] ? 'Asistirá' : 'No asistirá') . "\n";
}
if (isset($data['confirmaciones']['cocktail'])) {
    $message .= "Cocktail: " . ($data['confirmaciones']['cocktail'] ? 'Asistirá' : 'No asistirá') . "\n";
}
$message .= "\nAlergias/Restricciones: " . $data['alergias'];

$headers = 'From: ' . $data['email'] . "\r\n" .
    'Reply-To: ' . $data['email'] . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

// Enviar correo
$mailSent = mail($to, $subject, $message, $headers);

// Responder al cliente
if ($mailSent) {
    echo json_encode(['success' => true, 'message' => 'Confirmación enviada exitosamente']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al enviar la confirmación']);
}
?>