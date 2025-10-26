
import express from 'express';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../models/customer.js';
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
    await createUser({ full_name: value.full_name, email: value.email, password_hash });

    res.status(201).json({ message: 'User registered successfully' });
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

    const token = jwt.sign(
      { id: user.id, email: user.email, full_name: user.full_name },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
