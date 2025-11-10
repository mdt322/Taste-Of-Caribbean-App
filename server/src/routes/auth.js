
import express from 'express';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import { createUser, findUserByEmail, updateUserRewards } from '../models/customer.js';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

const registerSchema = Joi.object({
  full_name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

// Endpoint for user registration

router.post('/register', async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const existingUser = await findUserByEmail(value.email);
    if (existingUser) return res.status(409).json({ message: 'Email already in use' });

    const password_hash = await bcrypt.hash(value.password, parseInt(process.env.BCRYPT_SALT_ROUNDS));
    const createdUser = await createUser({ full_name: value.full_name, email: value.email, password_hash });

    // Map DB row to client-friendly user object
    const safeUser = {
      id: createdUser.id,
      name: createdUser.full_name,
      email: createdUser.email,
      joinDate: createdUser.created_at,
      loyaltyPoints: createdUser.rewards ?? 0,
      memberSince: createdUser.created_at,
      avatar: null,
    };

    res.status(201).json({ user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

// Endpoint for user login

router.post('/login', async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const user = await findUserByEmail(value.email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isPasswordValid = await bcrypt.compare(value.password, user.password_hash);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid password' });

    // Ensure rewards defaults to 150 if it's null/undefined in DB
    if (user.rewards === null || typeof user.rewards === 'undefined') {
      try {
        await updateUserRewards(user.email, 150);
      } catch (e) {
        console.error('Failed to set default rewards for user:', e);
      }
      // Re-fetch user after setting default
      const refreshed = await findUserByEmail(user.email);
      if (refreshed) user = refreshed;
    }

    const safeUser = {
      id: user.id,
      name: user.full_name,
      email: user.email,
      joinDate: user.created_at,
      loyaltyPoints: user.rewards ?? 0,
      memberSince: user.created_at,
      avatar: null,
    };

    res.status(200).json({ user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
