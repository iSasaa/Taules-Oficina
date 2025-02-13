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

$sql_delete = "DELETE FROM reserves WHERE usuari_id=$usuari_id AND data_reserva='$data_reserva' AND taula=$taula";

if ($conn->query($sql_delete) === TRUE) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "No s'ha pogut cancel·lar la reserva."]);
}

$conn->close();
?>
