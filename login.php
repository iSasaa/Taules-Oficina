<?php
include 'db.php';

$dades = json_decode(file_get_contents("php://input"), true);
$usuari = $conn->real_escape_string($dades['usuari']); // Protecció contra SQL Injection

// Comprovar si l'usuari ja existeix
$sql = "SELECT id FROM usuaris WHERE usuari='$usuari'";
$resultat = $conn->query($sql);

if ($resultat->num_rows > 0) {
    $fila = $resultat->fetch_assoc();
    echo json_encode(["success" => true, "usuari_id" => $fila['id']]);
} else {
    // Si l'usuari no existeix, el creem
    $sql_insert = "INSERT INTO usuaris (usuari) VALUES ('$usuari')";
    if ($conn->query($sql_insert) === TRUE) {
        echo json_encode(["success" => true, "usuari_id" => $conn->insert_id]);
    } else {
        echo json_encode(["success" => false, "error" => $conn->error]);
    }
}

$conn->close();
?>
