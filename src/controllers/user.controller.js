import db from '../config/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

// GET all users
export const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, name, email, telephone, role FROM users ORDER BY id DESC'
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

// CREATE new user
export const createUser = async (req, res) => {
  const { name, email, password, telephone, role } = req.body;

  if (!name || !email || !password || !telephone) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userRole = role === 'admin' ? 'admin' : 'user';

  try {
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, telephone, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, telephone, userRole]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      email,
      telephone,
      role: userRole
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user', error: error.message });
  }
};
