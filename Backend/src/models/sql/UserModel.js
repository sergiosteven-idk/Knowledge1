// src/models/sql/UserModel.js
// Funciones para trabajar con la tabla Miembro (MySQL)
import { mysqlConnection } from "../../../bds/mysql.js";

/**
 * Crea un usuario (retorna insertId).
 * Nota: asegúrate de hashear la contraseña antes de llamar a createUser
 * (o modificar aquí para hashear). En este proyecto lo haremos desde el controlador.
 */
export const createUser = async (user) => {
  const [result] = await mysqlConnection.execute(
    "INSERT INTO Miembro (nombre, apellido, correo, contrasena, tipo_usuario) VALUES (?, ?, ?, ?, ?)",
    [user.nombre, user.apellido, user.correo, user.contrasena, user.tipo_usuario]
  );
  return result.insertId;
};

/**
 * Busca un usuario por correo (retorna fila o undefined)
 */
export const findUserByEmail = async (correo) => {
  const [rows] = await mysqlConnection.execute(
    "SELECT * FROM Miembro WHERE correo = ?",
    [correo]
  );
  return rows[0];
};

/**
 * Obtener todos los usuarios (lista).
 * Devuelve campos útiles (no incluir contraseñas si no quieres exponerlas).
 */
export const getAllUsers = async () => {
  const [rows] = await mysqlConnection.execute(
    `SELECT id_usuario, nombre, apellido, correo, tipo_usuario, creado_en AS created_at, actualizado_en AS updated_at
     FROM Miembro`
  );
  return rows;
};

/**
 * Obtener un usuario por id_usuario
 */
export const getUserById = async (id) => {
  const [rows] = await mysqlConnection.execute(
    "SELECT id_usuario, nombre, apellido, correo, tipo_usuario FROM Miembro WHERE id_usuario = ?",
    [id]
  );
  return rows[0];
};

/**
 * Actualizar usuario (solo los campos que vengan en 'user' serán actualizados).
 * 'user' puede contener nombre, apellido, correo, tipo_usuario, contrasena (con hash si aplica).
 * Retorna affectedRows.
 */
export const updateUserById = async (id, user) => {
  const fields = [];
  const values = [];

  if (user.nombre !== undefined) {
    fields.push("nombre = ?");
    values.push(user.nombre);
  }
  if (user.apellido !== undefined) {
    fields.push("apellido = ?");
    values.push(user.apellido);
  }
  if (user.correo !== undefined) {
    fields.push("correo = ?");
    values.push(user.correo);
  }
  if (user.tipo_usuario !== undefined) {
    fields.push("tipo_usuario = ?");
    values.push(user.tipo_usuario);
  }
  if (user.contrasena !== undefined) {
    // aquí se espera la contraseña ya hasheada
    fields.push("contrasena = ?");
    values.push(user.contrasena);
  }

  if (fields.length === 0) {
    return 0; // nada que actualizar
  }

  values.push(id);
  const sql = `UPDATE Miembro SET ${fields.join(", ")} WHERE id_usuario = ?`;
  const [result] = await mysqlConnection.execute(sql, values);
  return result.affectedRows;
};

/**
 * Eliminar usuario por id_usuario. Retorna affectedRows.
 */
export const deleteUserById = async (id) => {
  const [result] = await mysqlConnection.execute(
    "DELETE FROM Miembro WHERE id_usuario = ?",
    [id]
  );
  return result.affectedRows;
};
