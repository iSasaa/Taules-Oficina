# Taules-Oficina

script sql de les BBDD utilitzades

CREATE DATABASE reserves_db;
USE reserves_db;

CREATE TABLE usuaris (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuari VARCHAR(50) UNIQUE NOT NULL,
);

CREATE TABLE reserves (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuari_id INT NOT NULL,
    data_reserva DATE NOT NULL,
    taula INT NOT NULL,
    FOREIGN KEY (usuari_id) REFERENCES usuaris(id),
    UNIQUE (data_reserva, taula)
);
