import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
if (process.env.NODE_ENV === "production") {
  app.use(cors({
    origin: "https://mern-test-sakshi-malik565.vercel.app",
    credentials: true
  }));
} else {
  app.use(cors());
}
app.use(express.json());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.listen(5000, () => {
    console.log('Server running on port 5000');
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.log(err));
});
