import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import { wrap, fail } from '../middleware/async.js';

export const getUsers = wrap(async (req, res) => res.json(await User.find().sort('-createdAt')));

export const addDoctor = wrap(async (req, res) => {
  const { name, email, password, specialization, experience } = req.body;
  if (!name?.trim() || !email?.trim() || !password || !specialization?.trim() || experience === undefined || experience === '')
    return fail(res, 400, 'Name, email, password, specialization and experience are required');
  if (password.length < 6) return fail(res, 400, 'Password must be at least 6 characters');
  if (await User.findOne({ email: email.toLowerCase() })) return fail(res, 409, 'That email is already registered');
  const doc = await User.create({ name, email, password, specialization, experience: Number(experience), role: 'doctor' });
  res.status(201).json(doc);
});

export const toggleStatus = wrap(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return fail(res, 404, 'User not found');
  if (user.role === 'admin') return fail(res, 400, 'Admin accounts cannot be changed');
  user.isActive = !user.isActive;
  await user.save();
  res.json(user);
});

export const deleteUser = wrap(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return fail(res, 404, 'User not found');
  if (user.role === 'admin') return fail(res, 400, 'Admin accounts cannot be deleted');
  await Appointment.deleteMany({ $or: [{ patient: user._id }, { doctor: user._id }] });
  await user.deleteOne();
  res.json({ message: 'User deleted' });
});

export const getAppointments = wrap(async (req, res) => {
  res.json(await Appointment.find().populate('patient', 'name email').populate('doctor', 'name specialization').sort('-createdAt'));
});

export const getStats = wrap(async (req, res) => {
  const [patients, doctors, appointments, pending] = await Promise.all([
    User.countDocuments({ role: 'patient' }),
    User.countDocuments({ role: 'doctor' }),
    Appointment.countDocuments(),
    Appointment.countDocuments({ status: 'pending' }),
  ]);
  res.json({ patients, doctors, appointments, pending });
});
