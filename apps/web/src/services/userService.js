import { api } from "../lib/api";

// GET /users
export async function getUsers() {
  const res = await api.get("/users");
  return res.data; // [{id_usuario, nombre, apellido, correo, tipo_usuario}, ...]
}

// DELETE /users/:id
export async function deleteUser(id_usuario) {
  const res = await api.delete(`/users/${id_usuario}`);
  return res.data;
}
