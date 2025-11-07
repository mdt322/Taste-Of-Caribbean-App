import express from 'express';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import { findUserByEmail, updateUserPassword } from '../models/customer.js';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

const changePasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  currentPassword: Joi.string().min(6).required(),
  newPassword: Joi.string().min(6).required()
});

// POST /api/password/change
router.post('/change', async (req, res) => {
  try {
    const { error, value } = changePasswordSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const user = await findUserByEmail(value.email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isPasswordValid = await bcrypt.compare(value.currentPassword, user.password_hash);
    if (!isPasswordValid) return res.status(401).json({ message: 'Current password is incorrect' });

    if (value.currentPassword === value.newPassword) return res.status(400).json({ message: 'New password must be different from current password' });

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
    const newHash = await bcrypt.hash(value.newPassword, saltRounds);

    await updateUserPassword(value.email, newHash);

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
