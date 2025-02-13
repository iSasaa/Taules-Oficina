<?php
$servidor = "localhost";
$usuari = "root"; // Per defecte en XAMPP
$contrasenya = ""; // Per defecte sense contrasenya
$base_dades = "reserves_db";

$conn = new mysqli($servidor, $usuari, $contrasenya, $base_dades);
if ($conn->connect_error) {
    die("Error de connexió: " . $conn->connect_error);
}
?>