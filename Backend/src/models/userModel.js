import pool from "../db.js";
import bcrypt from "bcrypt";

export async function crearUsuario(usuario, email, contrasena) {
  const hashedPass = await bcrypt.hash(contrasena, 10);
  const [result] = await pool.query(
    "INSERT INTO usuarios (usuario, email, contrasena) VALUES (?, ?, ?)",
    [usuario, email, hashedPass]
  );
  return result.insertId; // devuelve el ID del nuevo usuario
}

export async function buscarUsuarioPorEmail(email) {
  const [rows] = await pool.query(
    "SELECT * FROM usuarios WHERE email = ? LIMIT 1",
    [email]
  );
  return rows[0];
}
