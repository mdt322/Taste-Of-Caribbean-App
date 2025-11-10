import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import passwordRoutes from './routes/password.js';
import rewardsRoutes from './routes/rewards.js';

// Load environment variables

dotenv.config();
const app = express();

// Middleware

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/rewards', rewardsRoutes);

// Start the server

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
