import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { wrap, fail } from '../middleware/async.js';

const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '7d' });
const pub = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role, specialization: u.specialization, experience: u.experience });

export const register = wrap(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name?.trim() || !email?.trim() || !password) return fail(res, 400, 'Name, email and password are required');
  if (password.length < 6) return fail(res, 400, 'Password must be at least 6 characters');
  if (await User.findOne({ email: email.toLowerCase() })) return fail(res, 409, 'That email is already registered');
  // Public registration always creates a patient
  const user = await User.create({ name, email, password, role: 'patient' });
  res.status(201).json({ token: sign(user._id), user: pub(user) });
});

export const login = wrap(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: (email || '').toLowerCase() }).select('+password');
  if (!user || !(await user.matches(password || ''))) return fail(res, 401, 'Incorrect email or password');
  if (!user.isActive) return fail(res, 403, 'This account has been deactivated. Please contact the clinic');
  res.json({ token: sign(user._id), user: pub(user) });
});

export const me = (req, res) => res.json({ user: pub(req.user) });
