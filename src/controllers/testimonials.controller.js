import db from '../config/database.js';

export const getAllTestimonials = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM testimonials');
  res.json(rows);
};

export const getTestimonialById = async (req, res) => {
  const id = req.params.id;
  const [rows] = await db.query('SELECT * FROM testimonials WHERE id = ?', [id]);
  if (rows.length === 0) return res.status(404).json({ message: 'Not found' });
  res.json(rows[0]);
};

export const createTestimonial = async (req, res) => {
  const { customerName, message, rating } = req.body;
  if (!customerName || !message || typeof rating !== 'number') {
    return res.status(400).json({ message: 'Invalid input' });
  }

  const [result] = await db.query(
    'INSERT INTO testimonials (customerName, message, rating) VALUES (?, ?, ?)',
    [customerName, message, rating]
  );

  const newTestimonial = {
    id: result.insertId,
    customerName,
    message,
    rating
  };

  res.status(201).json(newTestimonial);
};

export const updateTestimonial = async (req, res) => {
  const id = req.params.id;
  const { customerName, message, rating } = req.body;

  const [result] = await db.query('UPDATE testimonials SET customerName = ?, message = ?, rating = ? WHERE id = ?', [
    customerName,
    message,
    rating,
    id
  ]);

  if (result.affectedRows === 0) return res.status(404).json({ message: 'Not found' });

  res.json({ id: parseInt(id), customerName, message, rating });
};

export const deleteTestimonial = async (req, res) => {
  const id = req.params.id;
  const [result] = await db.query('DELETE FROM testimonials WHERE id = ?', [id]);
  if (result.affectedRows === 0) return res.status(404).json({ message: 'Not found' });
  res.status(204).end();
};
