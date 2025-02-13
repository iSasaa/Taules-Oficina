<?php
include 'db.php';
header('Content-Type: application/json');

$dades = json_decode(file_get_contents("php://input"), true);

if (!$dades) {
    echo json_encode(["success" => false, "message" => "Error rebent dades"]);
    exit;
}

$usuari_id = $dades['usuari_id'];
$data_reserva = $dades['data'];
$taula = $dades['taula'];

// Elimina la reserva existent de l'usuari per al mateix dia
$sql_delete = "DELETE FROM reserves WHERE usuari_id=$usuari_id AND data_reserva='$data_reserva'";
$conn->query($sql_delete);

// Inserim la nova reserva
$sql_insert = "INSERT INTO reserves (usuari_id, data_reserva, taula) VALUES ($usuari_id, '$data_reserva', $taula)";
if ($conn->query($sql_insert) === TRUE) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Error en reservar"]);
}

$conn->close();
?>
