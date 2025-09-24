// src/controllers/userController.js
import bcrypt from "bcrypt";
import {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} from "../models/sql/UserModel.js";

// 📌 Obtener todos los usuarios
export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

// 📌 Obtener un usuario por ID
export const getUser = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener usuario" });
  }
};

// 📌 Actualizar usuario
export const updateUser = async (req, res) => {
  try {
    const { nombre, apellido, correo, contrasena, tipo_usuario } = req.body;

    const updateData = { nombre, apellido, correo, tipo_usuario };

    if (contrasena) {
      updateData.contrasena = await bcrypt.hash(contrasena, 10);
    }

    const affected = await updateUserById(req.params.id, updateData);

    if (affected === 0) {
      return res.status(404).json({ message: "Usuario no encontrado o sin cambios" });
    }

    res.json({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
};

// 📌 Eliminar usuario
export const deleteUser = async (req, res) => {
  try {
    const affected = await deleteUserById(req.params.id);
    if (affected === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
};
