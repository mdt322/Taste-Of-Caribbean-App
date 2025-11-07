import { pool } from '../db.js';

// Function to create a new user

export const createUser = async ({ full_name, email, password_hash }) => {
  const [result] = await pool.execute(
    'INSERT INTO customers (full_name, email, password_hash) VALUES (?, ?, ?)',
    [full_name, email, password_hash]
  );
  return result;
};

// Function to find user by email

export const findUserByEmail = async (email) => {
  const [rows] = await pool.execute(
    'SELECT * FROM customers WHERE email = ?',
    [email]
  );
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
