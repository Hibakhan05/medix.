import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import doctorRoutes from './routes/doctors.js';
import appointmentRoutes from './routes/appointments.js';
import adminRoutes from './routes/admin.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL?.split(',') || true }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((err, req, res, next) => {
  if (err.code === 11000) return res.status(409).json({ message: 'That email is already registered' });
  if (err.name === 'CastError') return res.status(400).json({ message: 'Invalid id supplied' });
  if (err.name === 'ValidationError') return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join(', ') });
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

const port = process.env.PORT || 5000;
connectDB()
  .then(() => app.listen(port, () => console.log(`MEDIX API running on port ${port}`)))
  .catch((e) => { console.error('Database connection failed:', e.message); process.exit(1); });
