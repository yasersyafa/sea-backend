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
}

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
}

// login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body

  // cek if the email || password are missing
  if(!email || !password)
    return res.status(400).json({ message: 'Email and password are required' })

  try {
    const [users] = await db.query('SELECT * FROM USERS WHERE email = ?', [email])

    // if user does not exist
    if(users.length === 0)
      return res.status(400).json({ message: 'User not found' })

    const user = users[0]
    const passwordMatch = await bcrypt.compare(password, user.password)

    // if password not match
    if(!passwordMatch)
      return  res.status(401).json({ message: 'Invalid password' })

    // generate the jwt
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        telephone: user.telephone,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    )

    res.json({
      message: 'Login successfull',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        telephone: user.telephone,
        role: user.role
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message })
  }
}
