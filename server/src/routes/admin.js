import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

// Get all customers (admin only)
router.get('/customers', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM customers');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: 'Error fetching customers' });
  }
});

export default router;
