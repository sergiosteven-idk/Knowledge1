// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors()); // en dev, esto está bien; en prod restringe el origin
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

// --- Middleware para proteger rutas ---
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token' });
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// --- SIGNUP: registra un usuario (hashea contraseña) ---
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { nombre, correo, contrasena } = req.body;
    if (!nombre || !correo || !contrasena) return res.status(400).json({ error: 'Faltan datos' });

    const [exists] = await pool.execute('SELECT id FROM usuarios WHERE correo = ?', [correo]);
    if (exists.length) return res.status(409).json({ error: 'Correo ya registrado' });

    const hash = await bcrypt.hash(contrasena, 10);
    const [result] = await pool.execute(
      'INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)',
      [nombre, correo, hash]
    );

    const token = jwt.sign({ id: result.insertId }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: result.insertId, nombre, correo } });
  } catch (err) {
    console.error('Error /signup:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// --- LOGIN: valida credenciales y retorna token ---
app.post('/api/auth/login', async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    if (!correo || !contrasena) return res.status(400).json({ error: 'Faltan datos' });

    const [rows] = await pool.execute('SELECT id, nombre, correo, contrasena FROM usuarios WHERE correo = ?', [correo]);
    if (!rows.length) return res.status(401).json({ error: 'Credenciales inválidas' });

    const user = rows[0];
    const match = await bcrypt.compare(contrasena, user.contrasena);
    if (!match) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, nombre: user.nombre, correo: user.correo } });
  } catch (err) {
    console.error('Error /login:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// --- GET perfil del usuario autenticado ---
app.get('/api/usuarios/me', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id, nombre, correo FROM usuarios WHERE id = ?', [req.userId]);
    if (!rows.length) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Error GET /usuarios/me:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// --- PATCH actualizar perfil (nombre, correo, contrasena) ---
app.patch('/api/usuarios/me', authenticate, async (req, res) => {
  try {
    const { nombre, correo, contrasena } = req.body;
    const updates = [];
    const params = [];

    if (nombre) { updates.push('nombre = ?'); params.push(nombre); }
    if (correo) { updates.push('correo = ?'); params.push(correo); }
    if (contrasena) {
      const hash = await bcrypt.hash(contrasena, 10);
      updates.push('contrasena = ?');
      params.push(hash);
    }
    if (!updates.length) return res.status(400).json({ error: 'Nada para actualizar' });

    params.push(req.userId);
    const sql = `UPDATE usuarios SET ${updates.join(', ')} WHERE id = ?`;
    await pool.execute(sql, params);

    const [rows] = await pool.execute('SELECT id, nombre, correo FROM usuarios WHERE id = ?', [req.userId]);
    res.json(rows[0]);
  } catch (err) {
    console.error('Error PATCH /usuarios/me:', err);
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Correo ya en uso' });
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// --- DELETE eliminar cuenta ---
app.delete('/api/usuarios/me', authenticate, async (req, res) => {
  try {
    await pool.execute('DELETE FROM usuarios WHERE id = ?', [req.userId]);
    res.json({ ok: true });
  } catch (err) {
    console.error('Error DELETE /usuarios/me:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// manejo básico de rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});
