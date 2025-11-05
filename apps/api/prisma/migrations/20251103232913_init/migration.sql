-- CreateTable
CREATE TABLE `Administrador` (
    `id_admin` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `correo` VARCHAR(100) NOT NULL,
    `contrasena` VARCHAR(255) NOT NULL,
    `tipo_admin` ENUM('super', 'editor', 'moderador') NULL DEFAULT 'editor',

    UNIQUE INDEX `correo`(`correo`),
    PRIMARY KEY (`id_admin`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Curso` (
    `id_curso` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(200) NOT NULL,
    `descripcion` TEXT NULL,
    `categoria` VARCHAR(100) NULL,
    `nivel` ENUM('bÃ¡sico', 'intermedio', 'avanzado') NULL DEFAULT 'bÃ¡sico',
    `fecha_inicio` DATE NULL,
    `fecha_fin` DATE NULL,

    PRIMARY KEY (`id_curso`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Donaciones` (
    `id_donacion` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `monto` DECIMAL(10, 2) NOT NULL,
    `fecha_donacion` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `metodo_pago` ENUM('tarjeta', 'paypal', 'transferencia') NULL,

    INDEX `id_usuario`(`id_usuario`),
    PRIMARY KEY (`id_donacion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Evaluacion` (
    `id_evaluacion` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(200) NOT NULL,
    `descripcion` TEXT NULL,
    `tipo` ENUM('quiz', 'examen', 'prÃ¡ctica') NULL DEFAULT 'quiz',
    `id_modulo` INTEGER NOT NULL,

    INDEX `id_modulo`(`id_modulo`),
    PRIMARY KEY (`id_evaluacion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Miembro` (
    `id_usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `apellido` VARCHAR(100) NOT NULL,
    `correo` VARCHAR(100) NOT NULL,
    `contrasena` VARCHAR(255) NOT NULL,
    `tipo_usuario` ENUM('estudiante', 'docente', 'invitado') NULL DEFAULT 'estudiante',
    `id_admin` INTEGER NULL,

    UNIQUE INDEX `correo`(`correo`),
    INDEX `id_admin`(`id_admin`),
    PRIMARY KEY (`id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Modulo` (
    `id_modulo` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_modulo` VARCHAR(200) NOT NULL,
    `descripcion` TEXT NULL,
    `id_curso` INTEGER NOT NULL,

    INDEX `id_curso`(`id_curso`),
    PRIMARY KEY (`id_modulo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permiso` (
    `id_permiso` INTEGER NOT NULL AUTO_INCREMENT,
    `accion` VARCHAR(100) NOT NULL,
    `recurso` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id_permiso`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pregunta` (
    `id_pregunta` INTEGER NOT NULL AUTO_INCREMENT,
    `texto` TEXT NOT NULL,
    `tipo` ENUM('opcion_multiple', 'verdadero_falso', 'respuesta_abierta') NULL,
    `opciones` JSON NULL,
    `respuesta_correcta` TEXT NULL,
    `id_evaluacion` INTEGER NOT NULL,

    INDEX `id_evaluacion`(`id_evaluacion`),
    PRIMARY KEY (`id_pregunta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Progreso` (
    `id_progreso` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `id_modulo` INTEGER NOT NULL,
    `estado` ENUM('pendiente', 'en progreso', 'completado') NULL DEFAULT 'pendiente',
    `ultima_modificacion` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `id_modulo`(`id_modulo`),
    INDEX `id_usuario`(`id_usuario`),
    PRIMARY KEY (`id_progreso`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Resultado` (
    `id_resultado` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `id_evaluacion` INTEGER NOT NULL,
    `calificacion` DECIMAL(5, 2) NULL,
    `fecha_realizacion` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `id_evaluacion`(`id_evaluacion`),
    INDEX `id_usuario`(`id_usuario`),
    PRIMARY KEY (`id_resultado`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rol` (
    `id_rol` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_rol` VARCHAR(100) NOT NULL,
    `descripcion` TEXT NULL,

    PRIMARY KEY (`id_rol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rol_Permiso` (
    `id_rol` INTEGER NOT NULL,
    `id_permiso` INTEGER NOT NULL,

    INDEX `id_permiso`(`id_permiso`),
    PRIMARY KEY (`id_rol`, `id_permiso`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Usuario_Rol` (
    `id_usuario` INTEGER NOT NULL,
    `id_rol` INTEGER NOT NULL,

    INDEX `id_rol`(`id_rol`),
    PRIMARY KEY (`id_usuario`, `id_rol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Donaciones` ADD CONSTRAINT `Donaciones_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `Miembro`(`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Evaluacion` ADD CONSTRAINT `Evaluacion_ibfk_1` FOREIGN KEY (`id_modulo`) REFERENCES `Modulo`(`id_modulo`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Miembro` ADD CONSTRAINT `Miembro_ibfk_1` FOREIGN KEY (`id_admin`) REFERENCES `Administrador`(`id_admin`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Modulo` ADD CONSTRAINT `Modulo_ibfk_1` FOREIGN KEY (`id_curso`) REFERENCES `Curso`(`id_curso`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Pregunta` ADD CONSTRAINT `Pregunta_ibfk_1` FOREIGN KEY (`id_evaluacion`) REFERENCES `Evaluacion`(`id_evaluacion`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Progreso` ADD CONSTRAINT `Progreso_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `Miembro`(`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Progreso` ADD CONSTRAINT `Progreso_ibfk_2` FOREIGN KEY (`id_modulo`) REFERENCES `Modulo`(`id_modulo`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Resultado` ADD CONSTRAINT `Resultado_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `Miembro`(`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Resultado` ADD CONSTRAINT `Resultado_ibfk_2` FOREIGN KEY (`id_evaluacion`) REFERENCES `Evaluacion`(`id_evaluacion`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Rol_Permiso` ADD CONSTRAINT `Rol_Permiso_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `Rol`(`id_rol`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Rol_Permiso` ADD CONSTRAINT `Rol_Permiso_ibfk_2` FOREIGN KEY (`id_permiso`) REFERENCES `Permiso`(`id_permiso`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Usuario_Rol` ADD CONSTRAINT `Usuario_Rol_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `Miembro`(`id_usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `Usuario_Rol` ADD CONSTRAINT `Usuario_Rol_ibfk_2` FOREIGN KEY (`id_rol`) REFERENCES `Rol`(`id_rol`) ON DELETE NO ACTION ON UPDATE NO ACTION;
