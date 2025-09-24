import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createUser, findUserByEmail } from "../models/sql/UserModel.js";

// Registro
export const register = async (req, res) => {
  try {
    // aceptar tanto correo/contrasena como email/password
    const { nombre, apellido, correo, email, contrasena, password, tipo_usuario } = req.body;

    const userEmail = correo || email;
    const userPassword = contrasena || password;

    // Validar campos
    if (!nombre || !apellido || !userEmail || !userPassword) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    // Verificar duplicado
    const existingUser = await findUserByEmail(userEmail);
    if (existingUser) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(userPassword, 10);

    // Crear usuario
    const newUserId = await createUser({
      nombre,
      apellido,
      correo: userEmail,
      contrasena: hashedPassword,
      tipo_usuario,
    });

    res.status(201).json({ message: "Usuario creado con éxito", userId: newUserId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el registro" });
  }
};

// Login
export const login = async (req, res) => {
  try {
    // aceptar tanto correo/contrasena como email/password
    const { correo, email, contrasena, password } = req.body;

    const userEmail = correo || email;
    const userPassword = contrasena || password;

    if (!userEmail || !userPassword) {
      return res.status(400).json({ message: "Correo y contraseña son obligatorios" });
    }

    const user = await findUserByEmail(userEmail);
    if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(userPassword, user.contrasena);
    if (!isMatch) return res.status(401).json({ message: "Contraseña incorrecta" });

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id_usuario, correo: user.correo, rol: user.tipo_usuario },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login exitoso", token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el login" });
  }
};
