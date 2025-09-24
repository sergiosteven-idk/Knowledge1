// src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

// Verificar que el usuario tenga token válido
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer token"

  if (!token) {
    return res.status(401).json({ message: "No se proporcionó token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // aquí tenemos { id, correo, rol }
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
};

// Verificar que el usuario sea admin
export const verifyAdmin = (req, res, next) => {
  if (req.user.rol !== "admin") {
    return res.status(403).json({ message: "Acceso denegado, solo admins" });
  }
  next();
};
