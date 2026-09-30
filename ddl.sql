DROP DATABASE IF EXISTS empresa_prueba;
CREATE DATABASE empresa_prueba;
USE empresa_prueba;

CREATE TABLE candidatos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    a_experiencia INT NOT NULL CHECK (a_experiencia >= 0)
);


CREATE TABLE vacantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    exp_minima INT NOT NULL CHECK (exp_minima >= 0),
    estado ENUM('OPEN', 'CLOSED') NOT NULL DEFAULT 'OPEN'
);

CREATE TABLE postulaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidato_id INT NOT NULL,
    vacante_id INT NOT NULL,
    carta TEXT,
    fuente ENUM('REFERRAL', 'INTERNAL', 'JOB_BOARD', 'OTHER') NOT NULL,
    puntaje INT NOT NULL CHECK (puntaje >= 0),
    prioridad ENUM('LOW', 'MEDIUM', 'HIGH', 'TOP') NOT NULL,
    estado ENUM('RECEIVED', 'IN_REVIEW', 'REJECTED', 'HIRED') NOT NULL DEFAULT 'RECEIVED',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizacion_estado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (candidato_id) REFERENCES candidatos(id) ON DELETE CASCADE,
    FOREIGN KEY (vacante_id) REFERENCES vacantes(id) ON DELETE CASCADE
);

-- Inserción de datos de prueba

INSERT INTO candidatos (nombre, email, a_experiencia) VALUES
('Antonio Canux', 'antonio@example.com', 5),
('María Fernández', 'maria.f@example.com', 1),
('Carlos Ruiz', 'cruiz@example.com', 3);

INSERT INTO vacantes (titulo, exp_minima, status) VALUES
('Desarrollador Backend Node.js', 3, 'OPEN'),
('Administrador de Base de Datos MySQL', 4, 'CLOSED');
