<?php
include 'db.php';

$data_reserva = $_GET['data'];
$sql = "SELECT r.taula, r.usuari_id, u.usuari 
        FROM reserves r 
        JOIN usuaris u ON r.usuari_id = u.id 
        WHERE r.data_reserva='$data_reserva'";
$resultat = $conn->query($sql);

$reserves = [];
while ($fila = $resultat->fetch_assoc()) {
    $reserves[] = [
        "taula" => $fila['taula'],
        "usuari_id" => $fila['usuari_id'],
        "usuari" => $fila['usuari']
    ];
}
echo json_encode($reserves);
$conn->close();
?>
