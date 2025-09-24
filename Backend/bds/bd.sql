CREATE DATABASE IF NOT EXISTS KNOWLEDGE;
USE KNOWLEDGE;

-- =========================
-- USUARIOS Y ADMINISTRACIÓN
-- =========================
CREATE TABLE IF NOT EXISTS Administrador (
    id_admin INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    tipo_admin ENUM('super', 'editor', 'moderador') DEFAULT 'editor'
);

CREATE TABLE IF NOT EXISTS Miembro (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    tipo_usuario ENUM('estudiante', 'docente', 'invitado') DEFAULT 'estudiante',
    id_admin INT,
    FOREIGN KEY (id_admin) REFERENCES Administrador(id_admin)
);

-- =========================
-- ROLES Y PERMISOS
-- =========================
CREATE TABLE IF NOT EXISTS Rol (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(100) NOT NULL,
    descripcion TEXT
);

CREATE TABLE IF NOT EXISTS Permiso (
    id_permiso INT AUTO_INCREMENT PRIMARY KEY,
    accion VARCHAR(100) NOT NULL,
    recurso VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS Rol_Permiso (
    id_rol INT,
    id_permiso INT,
    PRIMARY KEY (id_rol, id_permiso),
    FOREIGN KEY (id_rol) REFERENCES Rol(id_rol),
    FOREIGN KEY (id_permiso) REFERENCES Permiso(id_permiso)
);

CREATE TABLE IF NOT EXISTS Usuario_Rol (
    id_usuario INT,
    id_rol INT,
    PRIMARY KEY (id_usuario, id_rol),
    FOREIGN KEY (id_usuario) REFERENCES Miembro(id_usuario),
    FOREIGN KEY (id_rol) REFERENCES Rol(id_rol)
);

-- =========================
-- DONACIONES
-- =========================
CREATE TABLE IF NOT EXISTS Donaciones (
    id_donacion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha_donacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    metodo_pago ENUM('tarjeta', 'paypal', 'transferencia'),
    FOREIGN KEY (id_usuario) REFERENCES Miembro(id_usuario)
);

-- =========================
-- CURSOS Y PROGRESO
-- =========================
CREATE TABLE IF NOT EXISTS Curso (
    id_curso INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(100),
    nivel ENUM('básico', 'intermedio', 'avanzado') DEFAULT 'básico',
    fecha_inicio DATE,
    fecha_fin DATE
);

CREATE TABLE IF NOT EXISTS Modulo (
    id_modulo INT AUTO_INCREMENT PRIMARY KEY,
    nombre_modulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    id_curso INT NOT NULL,
    FOREIGN KEY (id_curso) REFERENCES Curso(id_curso)
);

CREATE TABLE IF NOT EXISTS Progreso (
    id_progreso INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_modulo INT NOT NULL,
    estado ENUM('pendiente', 'en progreso', 'completado') DEFAULT 'pendiente',
    ultima_modificacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES Miembro(id_usuario),
    FOREIGN KEY (id_modulo) REFERENCES Modulo(id_modulo)
);

-- =========================
-- EVALUACIONES
-- =========================
CREATE TABLE IF NOT EXISTS Evaluacion (
    id_evaluacion INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    tipo ENUM('quiz', 'examen', 'práctica') DEFAULT 'quiz',
    id_modulo INT NOT NULL,
    FOREIGN KEY (id_modulo) REFERENCES Modulo(id_modulo)
);

CREATE TABLE IF NOT EXISTS Pregunta (
    id_pregunta INT AUTO_INCREMENT PRIMARY KEY,
    texto TEXT NOT NULL,
    tipo ENUM('opcion_multiple', 'verdadero_falso', 'respuesta_abierta'),
    opciones JSON,
    respuesta_correcta TEXT,
    id_evaluacion INT NOT NULL,
    FOREIGN KEY (id_evaluacion) REFERENCES Evaluacion(id_evaluacion)
);

CREATE TABLE IF NOT EXISTS Resultado (
    id_resultado INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_evaluacion INT NOT NULL,
    calificacion DECIMAL(5,2),
    fecha_realizacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES Miembro(id_usuario),
    FOREIGN KEY (id_evaluacion) REFERENCES Evaluacion(id_evaluacion)
);

-- =========================
-- INSERTAR ADMIN POR DEFECTO
-- =========================
INSERT INTO Administrador (nombre, correo, contrasena, tipo_admin)
VALUES (
  'Super Admin',
  'admin@knowledge.com',
  '$2b$10$mp8Z04.5IOwZTuHGTFHwe.3GyQv3ewdTrgF/TMkTn.MlZPR25NuxO',
  'super'
);

INSERT INTO Miembro (nombre, apellido, correo, contrasena, tipo_usuario, id_admin)
VALUES (
  'Super',
  'Admin',
  'admin@knowledge.com',
  '$2b$10$mp8Z04.5IOwZTuHGTFHwe.3GyQv3ewdTrgF/TMkTn.MlZPR25NuxO',
  'docente',
  1
);
