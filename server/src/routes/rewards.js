import express from 'express';
import { findUserByEmail, updateUserRewards, redeemUserRewards, incrementUserRewards } from '../models/customer.js';

const router = express.Router();

// Get current rewards for a user by email (query param or body can be used client-side)
router.get('/', async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ rewards: user.rewards ?? 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Redeem points: body { email, points }
router.post('/redeem', async (req, res) => {
  try {
    const { email, points } = req.body;
    if (!email || typeof points !== 'number') return res.status(400).json({ message: 'Email and points (number) required' });

    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if ((user.rewards ?? 0) < points) {
      return res.status(400).json({ message: 'Insufficient rewards points', current: user.rewards ?? 0 });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const updated = await redeemUserRewards(normalizedEmail, points);
    if (!updated) {
      // Re-fetch user to provide a more specific error (race-condition or insufficient points)
      const latest = await findUserByEmail(normalizedEmail);
      if (!latest) return res.status(404).json({ message: 'User not found' });
      // If latest points are less than requested, inform client
      if ((latest.rewards ?? 0) < points) {
        return res.status(400).json({ message: 'Insufficient rewards points', current: latest.rewards ?? 0 });
      }
      // Otherwise return a generic failure
      return res.status(500).json({ message: 'Unable to redeem points' });
    }

    // Return the updated user row so client can sync full state
    res.json({ message: 'Redeemed', user: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// (Optional) Admin or client endpoint to set rewards explicitly
router.patch('/set', async (req, res) => {
  try {
    const { email, rewards } = req.body;
    if (!email || typeof rewards !== 'number') return res.status(400).json({ message: 'Email and rewards (number) required' });

    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await updateUserRewards(email, rewards);
    res.json({ message: 'Updated', rewards });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Refund points back to user (e.g., when user removes a redeemed item before checkout)
router.post('/refund', async (req, res) => {
  try {
    const { email, points } = req.body;
    if (!email || typeof points !== 'number') return res.status(400).json({ message: 'Email and points (number) required' });

    const normalizedEmail = String(email).trim().toLowerCase();
    const updated = await incrementUserRewards(normalizedEmail, points);
    if (!updated) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Refunded', user: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
