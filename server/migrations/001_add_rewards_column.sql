-- Migration: add rewards column to customers
-- Run this once against your MySQL database

ALTER TABLE customers
  ADD COLUMN IF NOT EXISTS rewards INT NOT NULL DEFAULT 100;

-- Ensure existing rows have a non-null value (defensive)
UPDATE customers SET rewards = 150 WHERE rewards IS NULL;
