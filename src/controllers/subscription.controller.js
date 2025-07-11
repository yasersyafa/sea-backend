import db from '../config/database.js';

const PLAN_PRICES = {
  diet: 30000,
  protein: 40000,
  royal: 60000,
};

export const createSubscription = async (req, res) => {
  const { plan, mealTypes, deliveryDays, allergies } = req.body;
  const userId = req.user?.id; // Ambil dari JWT

  if (!userId || !plan || !mealTypes || !deliveryDays) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (!Array.isArray(mealTypes) || mealTypes.length === 0 || !Array.isArray(deliveryDays) || deliveryDays.length === 0) {
    return res.status(400).json({ message: 'Meal types and delivery days must be non-empty arrays' });
  }

  const PLAN_PRICES = {
    diet: 30000,
    protein: 40000,
    royal: 60000,
  };

  const planPrice = PLAN_PRICES[plan.toLowerCase()];
  if (!planPrice) {
    return res.status(400).json({ message: 'Invalid plan selected' });
  }

  try {
    const [users] = await db.query('SELECT name, telephone FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const subscriber = await db.query('SELECT * FROM subscriptions WHERE userId = ?', userId)
    if(subscriber) return res.status(403).json({ message: 'Already have a plan' })

    const totalPrice = Math.round(planPrice * mealTypes.length * deliveryDays.length * 4.3);

    const [result] = await db.query(
      'INSERT INTO subscriptions (userId, plan, mealTypes, deliveryDays, allergies, price) VALUES (?, ?, ?, ?, ?, ?)',
      [
        userId,
        plan,
        JSON.stringify(mealTypes),
        JSON.stringify(deliveryDays),
        allergies || null,
        totalPrice,
      ]
    );

    res.status(201).json({
      id: result.insertId,
      user: users[0],
      plan,
      mealTypes,
      deliveryDays,
      allergies,
      price: totalPrice,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create subscription', error: error.message });
  }
}

export const getAllSubscriptions = async (req, res) => {
  const isAdmin = req.user?.role === 'Admin'
  try {
    let query = `
        SELECT 
            s.id, s.plan, s.mealTypes, s.deliveryDays, s.allergies, s.price,
            u.id AS userId, u.name AS userName, u.telephone AS userPhone, u.email
        FROM subscriptions s
        JOIN users u ON s.userId = u.id
    ` 
    const params = []
    if(!isAdmin) {
        query += ' WHERE s.userId = ?'
        params.push(req.user.id)
    }

    query += ' ORDER BY s.id DESC'
    const [rows] = await db.query(query, params);

    // Parse JSON fields
    const subscriptions = rows.map(row => ({
      id: row.id,
      plan: row.plan,
      mealTypes: JSON.parse(row.mealTypes),
      deliveryDays: JSON.parse(row.deliveryDays),
      allergies: row.allergies,
      price: row.price,
      user: {
        id: row.userId,
        name: row.userName,
        phone: row.userPhone,
        email: row.email
      }
    }));

    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch subscriptions', error: error.message });
  }
}

export const getOwnSubscription = async (req, res) => {
    try {
    const [rows] = await db.query(`
      SELECT 
        s.id, s.plan, s.mealTypes, s.deliveryDays, s.allergies, s.price,
        u.id AS userId, u.name AS userName, u.telephone AS userPhone, u.email
      FROM subscriptions s
      JOIN users u ON s.userId = u.id
      WHERE s.userId = ?
      ORDER BY s.id DESC
    `, [req.user.id]);

    // Parse JSON fields
    const subscriptions = rows.map(row => ({
      id: row.id,
      plan: row.plan,
      mealTypes: JSON.parse(row.mealTypes),
      deliveryDays: JSON.parse(row.deliveryDays),
      allergies: row.allergies,
      price: row.price,
      user: {
        id: row.userId,
        name: row.userName,
        phone: row.userPhone,
        email: row.email
      }
    }));

    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch subscriptions', error: error.message });
  }
}
