import { pool } from '../db.js';

// Function to create a new user

export const createUser = async ({ full_name, email, password_hash }) => {
  const [result] = await pool.execute(
    // rewards column has a default at the DB level; no need to pass it here
    'INSERT INTO customers (full_name, email, password_hash) VALUES (?, ?, ?)',
    [full_name, email, password_hash]
  );
  // Return the newly created user row
  const insertId = result.insertId;
  const [rows] = await pool.execute('SELECT * FROM customers WHERE id = ?', [insertId]);
  return rows[0];
};

// Function to find user by email

export const findUserByEmail = async (email) => {
  const [rows] = await pool.execute(
    'SELECT * FROM customers WHERE email = ?',
    [email]
  );
  return rows[0];
};

// Update rewards value for a user (set explicit value)
export const updateUserRewards = async (email, rewards) => {
  const [result] = await pool.execute(
    'UPDATE customers SET rewards = ? WHERE email = ?',
    [rewards, email]
  );
  return result;
};

// Increment rewards by given points and return updated row
export const incrementUserRewards = async (email, points) => {
  const [result] = await pool.execute(
    'UPDATE customers SET rewards = rewards + ? WHERE email = ?',
    [points, email]
  );
  if (result.affectedRows === 0) return null;
  const [rows] = await pool.execute('SELECT * FROM customers WHERE email = ?', [email]);
  return rows[0];
};

// Decrement rewards by points if user has enough; returns the updated row or null
export const redeemUserRewards = async (email, pointsToRedeem) => {
  // Use a single UPDATE with condition to avoid race conditions
  const [result] = await pool.execute(
    'UPDATE customers SET rewards = rewards - ? WHERE email = ? AND rewards >= ?',
    [pointsToRedeem, email, pointsToRedeem]
  );

  if (result.affectedRows === 0) {
    return null; // not enough points or user not found
  }

  const [rows] = await pool.execute('SELECT * FROM customers WHERE email = ?', [email]);
  return rows[0];
};

// Update a user's password hash by email
export const updateUserPassword = async (email, new_password_hash) => {
  const [result] = await pool.execute(
    'UPDATE customers SET password_hash = ? WHERE email = ?',
    [new_password_hash, email]
  );
  return result;
};
