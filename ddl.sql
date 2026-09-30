USE empresa_prueba;

CREATE TABLE candidato(
    id INT PRIMARY kEY AUTOINCREMENT,
    nombre VARCHAR(50) NOT NULL,
    email VARCHAR(70) NOT NULL,
    a_experiencia INT
)ENGINE=InnoDB;

CREATE TABLE vacante(
    id INT PRIMARY kEY AUTOINCREMENT,
    titulo_cargo VARCHAR(30) NOT NULL,
    a_min_experiencia INT,
    estado ENUM('OPEN', 'CLOSED')
)ENGINE=InnoDB;

CREATE TABLE postulacion(

)ENGINE=InnoDB;
