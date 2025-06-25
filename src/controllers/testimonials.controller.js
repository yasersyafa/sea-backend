import db from '../config/database.js';

export const getAllTestimonials = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        t.id, t.message, t.rating, t.createdAt,
        u.id AS userId, u.name AS userName
      FROM testimonials t
      JOIN users u ON t.userId = u.id
      ORDER BY t.createdAt DESC
    `);

    const testimonials = rows.map(row => ({
      id: row.id,
      message: row.message,
      rating: row.rating,
      createdAt: row.createdAt,
      user: {
        id: row.userId,
        name: row.userName
      }
    }));

    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch testimonials', error: error.message });
  }
};

export const getTestimonialById = async (req, res) => {
  const id = req.params.id;
  const [rows] = await db.query('SELECT * FROM testimonials WHERE id = ?', [id]);
  if (rows.length === 0) return res.status(404).json({ message: 'Not found' });
  res.json(rows[0]);
};

export const createTestimonial = async (req, res) => {
  const { message, rating } = req.body
  const userId = req.user?.id

  if(!userId || !message || !rating) {
    return res.status(400).json({ message: 'Missing required fields!' })
  }

  try {
    const [userResult] = await db.query('SELECT name FROM users WHERE id = ?', [userId])

    if(userResult.length === 0) {
      return res.status(404).json({ message: 'User not found' })
    }

    const [result] = await db.query('INSERT INTO testimonials (userId, message, rating) VALUES (?, ?, ?)', [userId, message, rating])

    res.status(201).json({
      id: result.id,
      user: { id: userId, name: userResult[0].name },
      message,
      rating
    })
  } catch (error) {
    res.status(500).json({ message: 'Failed to add testimonial', error: error.message })
  }
}

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
